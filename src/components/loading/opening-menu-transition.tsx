import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";

interface OpeningMenuTransitionProps {
  /** Enquanto true, a capa permanece fechada (hold). */
  hold: boolean;
  onFinished?: () => void;
}

/** Arranque suave no desprender do canto, depois ritmo constante até o fim. */
const OPEN_MS = 1800;
const EASE_OPEN = [0.3, 0, 0.7, 0.7] as const;
const MESSAGE = "Preparando uma experiência gastronômica...";
const SWIPE_HINT = "Deslize para abrir";
/** O canto agarrado viaja até além da borda esquerda → a folha sai de cena. */
const CORNER_TRAVEL_X = 2.15;
/** Elevação do canto no meio do curso — mantém a dobra diagonal e curva. */
const CORNER_LIFT_Y = 0.55;
/** Estado 2: quanto da abertura acontece automaticamente antes de aguardar. */
const PEEK_PROGRESS = 0.14;
const PEEK_LOW = 0.1;
const PEEK_IN_MS = 900;
/** Estado 3: tempo máximo aguardando o usuário antes de continuar sozinho. */
const WAIT_MS = 5000;

function CoverFace({ sweep }: { sweep: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-8">
      <div className="relative flex w-full max-w-xs flex-col items-center sm:max-w-sm md:max-w-md">
        <div className={sweep ? "light-sweep" : undefined}>
          <BrandLogo variant="dark" priority className="w-full" />
        </div>

        <div className="mt-12 w-40 overflow-hidden sm:w-52" aria-hidden="true">
          <div className="h-px w-full bg-border">
            <motion.div
              className="h-px bg-brand-clay"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: sweep ? 1.55 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
          {MESSAGE}
        </p>
      </div>
    </div>
  );
}

type Point = readonly [number, number];

/** Recorta o retângulo da página por um semiplano (Sutherland–Hodgman, 1 aresta). */
function clipRectByHalfPlane(w: number, h: number, sd: (x: number, y: number) => number) {
  const rect: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const out: Point[] = [];
  for (let i = 0; i < rect.length; i++) {
    const cur = rect[i];
    const nxt = rect[(i + 1) % rect.length];
    const sc = sd(cur[0], cur[1]);
    const sn = sd(nxt[0], nxt[1]);
    if (sc >= 0) out.push(cur);
    if (sc >= 0 !== sn >= 0) {
      const t = sc / (sc - sn);
      out.push([cur[0] + t * (nxt[0] - cur[0]), cur[1] + t * (nxt[1] - cur[1])]);
    }
  }
  return out;
}

function toClipPath(points: Point[]) {
  if (points.length < 3) return "polygon(0px 0px, 0px 0px, 0px 0px)";
  return `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
}

interface Fold {
  /** Parte da capa ainda plana (frente visível). */
  clipFront: string;
  /** Região dobrada, em coordenadas da página (antes do espelhamento). */
  clipFlap: string;
  /** Espelhamento da região dobrada em torno da linha de dobra. */
  flapTransform: string;
  /** Ponto médio da dobra — ancora sombras e brilho. */
  mx: number;
  my: number;
}

/**
 * Física do page curl: o canto inferior-direito (w, h) é "agarrado" e viaja
 * para a esquerda subindo no meio do curso. A linha de dobra é a mediatriz
 * entre o canto original e sua posição atual; a parte dobrada é o reflexo
 * da página em torno dessa linha — o verso fica visível por cima, como uma
 * página real virando.
 */
function computeFold(p: number, w: number, h: number): Fold {
  const fullFront = `polygon(0px 0px, ${w}px 0px, ${w}px ${h}px, 0px ${h}px)`;
  const cx = w - CORNER_TRAVEL_X * w * p;
  const cy = h - CORNER_LIFT_Y * h * Math.sin(Math.PI * p);
  const dx = cx - w;
  const dy = cy - h;
  const len = Math.hypot(dx, dy);
  if (len < 1 || w === 0) {
    return {
      clipFront: fullFront,
      clipFlap: "polygon(0px 0px, 0px 0px, 0px 0px)",
      flapTransform: "none",
      mx: w,
      my: h,
    };
  }

  // Normal da dobra apontando para o lado que dobra (lado do canto original).
  const nx = -dx / len;
  const ny = -dy / len;
  const mx = (w + cx) / 2;
  const my = (h + cy) / 2;
  const sd = (x: number, y: number) => (x - mx) * nx + (y - my) * ny;

  const front = clipRectByHalfPlane(w, h, (x, y) => -sd(x, y));
  const flap = clipRectByHalfPlane(w, h, sd);

  // Matriz de reflexão em torno da linha de dobra (transform-origin 0 0).
  const a = 1 - 2 * nx * nx;
  const b = -2 * nx * ny;
  const d = 1 - 2 * ny * ny;
  const e = mx - (a * mx + b * my);
  const f = my - (b * mx + d * my);

  return {
    clipFront: toClipPath(front),
    clipFlap: toClipPath(flap),
    flapTransform: `matrix(${a.toFixed(5)}, ${b.toFixed(5)}, ${b.toFixed(5)}, ${d.toFixed(5)}, ${e.toFixed(2)}, ${f.toFixed(2)})`,
    mx,
    my,
  };
}

type Phase = "hold" | "peek" | "opening";

/**
 * Capa de cardápio abrindo como página real (page curl), em 4 estados:
 * 1. hold — capa fechada enquanto o catálogo carrega;
 * 2. peek — o canto inferior-direito se ergue sozinho e fica "respirando";
 * 3. espera — surge "Deslize para abrir"; toque/deslize (ou 5s) continua;
 * 4. opening — a folha dobra sobre si mesma mostrando o verso e sai pela
 *    esquerda — o conteúdo abaixo permanece imóvel o tempo todo.
 */
export function OpeningMenuTransition({ hold, onFinished }: OpeningMenuTransitionProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("hold");
  const phaseRef = useRef<Phase>("hold");
  const openingStarted = useRef(false);
  const finishedRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const waitTimerRef = useRef<number | null>(null);

  const progress = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      sizeRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Trava pan/scroll touch no documento enquanto a capa existir (peek + opening)
  useEffect(() => {
    window.scrollTo(0, 0);
    const blockTouchScroll = (event: TouchEvent) => {
      event.preventDefault();
    };
    document.addEventListener("touchmove", blockTouchScroll, { passive: false });
    return () => {
      document.removeEventListener("touchmove", blockTouchScroll);
      window.scrollTo(0, 0);
    };
  }, []);

  const setPhaseSynced = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished?.();
  };

  const clearWaitTimer = () => {
    if (waitTimerRef.current !== null) {
      window.clearTimeout(waitTimerRef.current);
      waitTimerRef.current = null;
    }
  };

  /** Estado 4: retoma de onde o peek parou e completa o curso em ritmo constante. */
  const continueOpening = () => {
    if (phaseRef.current !== "peek") return;
    setPhaseSynced("opening");
    clearWaitTimer();
    controlsRef.current?.stop();
    const start = progress.get();
    controlsRef.current = animate(progress, 1, {
      duration: (OPEN_MS / 1000) * (1 - start),
      ease: EASE_OPEN,
      onComplete: finish,
    });
  };

  useEffect(() => {
    if (hold) {
      openingStarted.current = false;
      finishedRef.current = false;
      controlsRef.current?.stop();
      clearWaitTimer();
      progress.set(0);
      setPhaseSynced("hold");
      return;
    }

    if (openingStarted.current) return;
    openingStarted.current = true;

    if (reduceMotion) {
      finish();
      return;
    }

    // Estado 2: início automático da abertura — o canto se desprende sozinho
    setPhaseSynced("peek");
    controlsRef.current = animate(progress, PEEK_PROGRESS, {
      duration: PEEK_IN_MS / 1000,
      ease: [0.3, 0, 0.55, 1],
      onComplete: () => {
        if (phaseRef.current !== "peek") return;
        // Respiração sutil do canto enquanto aguarda — papel vivo, convite ao toque
        controlsRef.current = animate(progress, [PEEK_PROGRESS, PEEK_LOW, PEEK_PROGRESS], {
          duration: 2.6,
          ease: "easeInOut",
          repeat: Infinity,
        });
      },
    });

    // Estado 3: aguarda interação; sem toque em 5s, continua sozinho
    waitTimerRef.current = window.setTimeout(continueOpening, WAIT_MS);

    return () => {
      controlsRef.current?.stop();
      clearWaitTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold, reduceMotion]);

  const isPeek = phase === "peek";
  const isRevealed = phase !== "hold";

  const fold = useTransform(progress, (p) => computeFold(p, sizeRef.current.w, sizeRef.current.h));
  const clipFront = useTransform(fold, (f) => f.clipFront);
  const clipFlap = useTransform(fold, (f) => f.clipFlap);
  const flapTransform = useTransform(fold, (f) => f.flapTransform);

  /** Sombra da folha erguida sobre a parte ainda plana da capa. */
  const frontShade = useTransform(fold, (f) => {
    const r = Math.max(sizeRef.current.w, sizeRef.current.h) * 0.55;
    return `radial-gradient(circle ${r.toFixed(0)}px at ${f.mx.toFixed(0)}px ${f.my.toFixed(0)}px, color-mix(in oklab, var(--color-brand-navy) 26%, transparent), transparent 72%)`;
  });
  const frontShadeOpacity = useTransform(progress, [0, 0.06, 0.8, 1], [0, 0.55, 0.4, 0]);

  /** Brilho na dobra do verso — luz pegando na curvatura do papel. */
  const flapSheen = useTransform(fold, (f) => {
    const r = Math.max(sizeRef.current.w, sizeRef.current.h) * 0.5;
    return `radial-gradient(circle ${r.toFixed(0)}px at ${f.mx.toFixed(0)}px ${f.my.toFixed(0)}px, oklch(1 0 0 / 0.55), transparent 62%)`;
  });

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] touch-none",
        phase === "hold" && "overflow-hidden bg-background",
        isPeek && "cursor-pointer overflow-visible bg-transparent select-none",
        /* Mantém a capa recebendo o toque no opening — evita scroll na home por baixo */
        phase === "opening" && "overflow-visible bg-transparent",
      )}
      aria-hidden={phase === "opening" ? true : undefined}
      role={phase === "hold" ? "status" : isPeek ? "button" : undefined}
      aria-live={phase === "hold" ? "polite" : undefined}
      aria-label={isPeek ? SWIPE_HINT : undefined}
      tabIndex={isPeek ? 0 : undefined}
      onPointerUp={isPeek ? continueOpening : undefined}
      onKeyDown={
        isPeek
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") continueOpening();
            }
          : undefined
      }
    >
      {/* Frente da capa — encolhe conforme a linha de dobra varre a página */}
      <motion.div
        className="absolute inset-0 z-[1] bg-background"
        style={{ clipPath: isRevealed ? clipFront : undefined }}
      >
        <CoverFace sweep={!reduceMotion && phase === "hold"} />

        {/* Sombra projetada pela folha erguida — acompanha a dobra e some */}
        {isRevealed ? (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: frontShade, opacity: frontShadeOpacity }}
            aria-hidden="true"
          />
        ) : null}
      </motion.div>

      {/* Aba dobrada — o verso da mesma folha, espelhado na linha de dobra */}
      {isRevealed ? (
        <motion.div
          className="absolute inset-0 z-[2] will-change-transform"
          style={{
            clipPath: clipFlap,
            transform: flapTransform,
            transformOrigin: "0px 0px",
            filter:
              "drop-shadow(0px 10px 26px color-mix(in oklab, var(--color-brand-navy) 38%, transparent))",
          }}
          aria-hidden="true"
        >
          {/* Verso do papel — levemente mais claro que a frente */}
          <div
            className="absolute inset-0"
            style={{
              background: "color-mix(in oklab, var(--color-background) 92%, white)",
            }}
          />

          {/* Brilho na dobra (curvatura) */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: flapSheen, opacity: 0.9 }}
          />

          {/* Sombreado ambiente do verso — volume de papel, nunca um plano chapado */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(
                135deg,
                color-mix(in oklab, var(--color-brand-navy) 7%, transparent),
                transparent 45%,
                color-mix(in oklab, var(--color-brand-navy) 9%, transparent)
              )`,
            }}
          />
        </motion.div>
      ) : null}

      {/* Estado 3: convite discreto — some assim que a abertura continua */}
      {isRevealed ? (
        <motion.p
          className="pointer-events-none absolute bottom-16 left-1/2 z-[3] -translate-x-1/2 text-[0.65rem] tracking-[0.24em] whitespace-nowrap text-muted-foreground uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: isPeek ? 1 : 0 }}
          transition={{ duration: isPeek ? 0.6 : 0.2, delay: isPeek ? 0.4 : 0 }}
          aria-hidden="true"
        >
          {SWIPE_HINT}
        </motion.p>
      ) : null}
    </div>
  );
}
