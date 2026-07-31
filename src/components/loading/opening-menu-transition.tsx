import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";

interface OpeningMenuTransitionProps {
  /** Enquanto true, a capa permanece fechada (hold). */
  hold: boolean;
  onFinished?: () => void;
}

/** Ritmo quase constante, com leve desaceleração no fim. */
const OPEN_MS = 1550;
const EASE_OPEN = [0.0, 0.0, 0.18, 1] as const;
const MESSAGE = "Preparando uma experiência gastronômica...";
/** Abertura da capa em torno do eixo esquerdo (sem translateX). */
const OPEN_ANGLE = -112;

function CoverFace({ sweep }: { sweep: boolean }) {
  return (
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
  );
}

/**
 * Uma única folha-capa: eixo na esquerda, abre da direita → esquerda.
 * Sem faixas, sem segunda página, sem deslize horizontal.
 */
export function OpeningMenuTransition({ hold, onFinished }: OpeningMenuTransitionProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"hold" | "opening">("hold");
  const openingStarted = useRef(false);
  const finishedRef = useRef(false);

  const progress = useMotionValue(0);

  useEffect(() => {
    if (hold) {
      openingStarted.current = false;
      finishedRef.current = false;
      progress.set(0);
      setPhase("hold");
      return;
    }

    if (openingStarted.current) return;
    openingStarted.current = true;

    if (reduceMotion) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinished?.();
      }
      return;
    }

    setPhase("opening");
    const controls = animate(progress, 1, {
      duration: OPEN_MS / 1000,
      ease: EASE_OPEN,
    });

    const timer = window.setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinished?.();
      }
    }, OPEN_MS);

    return () => {
      controls.stop();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold, reduceMotion]);

  const isOpening = phase === "opening";

  const leafRotate = useTransform(progress, (p) => OPEN_ANGLE * p);
  const shadowRotate = useTransform(progress, (p) => OPEN_ANGLE * 0.42 * p);
  const shadowOpacity = useTransform(progress, [0, 0.1, 0.55, 0.9, 1], [0, 0.38, 0.45, 0.18, 0]);

  /** Curvatura visual na borda direita (início do desprendimento) — mesma folha. */
  const curlGlow = useTransform(progress, [0, 0.08, 0.35, 0.7, 1], [0, 0.55, 0.4, 0.15, 0]);
  const faceShade = useTransform(progress, [0, 0.25, 0.6, 1], [0, 0.12, 0.28, 0.08]);
  const spineOpacity = useTransform(progress, [0, 0.1, 0.7, 1], [0.2, 0.75, 0.5, 0]);
  const edgeThickness = useTransform(progress, [0, 0.15, 0.85, 1], [0.3, 1, 0.7, 0]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120]",
        isOpening
          ? "pointer-events-none overflow-visible bg-transparent"
          : "overflow-hidden bg-background",
      )}
      aria-hidden={!hold}
      role={hold ? "status" : undefined}
      aria-live={hold ? "polite" : undefined}
    >
      <div
        className="relative size-full"
        style={{
          perspective: "1700px",
          perspectiveOrigin: "left center",
        }}
      >
        {/* Sombra sobre o conteúdo abaixo — acompanha e some */}
        {isOpening ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[1] origin-left"
            style={{
              rotateY: shadowRotate,
              opacity: shadowOpacity,
              background: `linear-gradient(
                to right,
                color-mix(in oklab, var(--color-brand-navy) 42%, transparent) 0%,
                color-mix(in oklab, var(--color-brand-navy) 16%, transparent) 32%,
                transparent 68%
              )`,
              filter: "blur(18px)",
              transformStyle: "preserve-3d",
            }}
            aria-hidden="true"
          />
        ) : null}

        {/* Única folha */}
        <motion.div
          className="absolute inset-0 z-[2] flex origin-left flex-col items-center justify-center bg-background px-8 will-change-transform"
          style={{
            rotateY: isOpening ? leafRotate : 0,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            // sem translateX / scale — só rotação no eixo esquerdo
          }}
        >
          <CoverFace sweep={!reduceMotion && !isOpening} />

          {/* Sombra suave na face (perspectiva / volume) */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: isOpening ? faceShade : 0,
              background: `linear-gradient(
                to right,
                color-mix(in oklab, var(--color-brand-navy) 18%, transparent) 0%,
                transparent 42%,
                color-mix(in oklab, var(--color-brand-navy) 8%, transparent) 100%
              )`,
            }}
            aria-hidden="true"
          />

          {/* Curva orgânica na lateral direita — destaque na mesma superfície */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 right-0 w-[28%]"
            style={{
              opacity: isOpening ? curlGlow : 0,
              background: `linear-gradient(
                to left,
                color-mix(in oklab, white 55%, transparent) 0%,
                color-mix(in oklab, var(--color-brand-cream) 40%, transparent) 35%,
                color-mix(in oklab, var(--color-brand-navy) 10%, transparent) 62%,
                transparent 100%
              )`,
            }}
            aria-hidden="true"
          />

          {/* Espessura da borda direita */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 right-0 w-[3px]"
            style={{
              opacity: isOpening ? edgeThickness : 0.35,
              background: `linear-gradient(
                to left,
                color-mix(in oklab, var(--color-brand-line) 85%, var(--color-brand-cream)),
                var(--color-brand-cream)
              )`,
              boxShadow: "1px 0 0 color-mix(in oklab, var(--color-brand-navy) 10%, transparent)",
            }}
            aria-hidden="true"
          />

          {/* Lombada / espessura no eixo esquerdo */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-[5px]"
            style={{
              opacity: spineOpacity,
              background: `linear-gradient(
                to right,
                color-mix(in oklab, var(--color-brand-navy) 20%, var(--color-brand-cream)),
                var(--color-brand-cream) 70%,
                transparent
              )`,
              boxShadow: "2px 0 12px color-mix(in oklab, var(--color-brand-navy) 14%, transparent)",
            }}
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </div>
  );
}
