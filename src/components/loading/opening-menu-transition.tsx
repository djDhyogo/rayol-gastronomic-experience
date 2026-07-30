import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";

interface OpeningMenuTransitionProps {
  /** Enquanto true, a capa permanece fechada (hold). */
  hold: boolean;
  onFinished?: () => void;
}

const OPEN_MS = 1450;
const EASE_OPEN = [0.22, 0.61, 0.36, 1] as const;
const MESSAGE = "Preparando uma experiência gastronômica...";

/**
 * Capa inicial em tom creme (igual ao print) — só logo + CSS.
 * Hold → abertura 3D → site por trás.
 */
export function OpeningMenuTransition({ hold, onFinished }: OpeningMenuTransitionProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"hold" | "opening">("hold");
  const openingStarted = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (hold) {
      openingStarted.current = false;
      finishedRef.current = false;
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
    const timer = window.setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinished?.();
      }
    }, OPEN_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hold, reduceMotion]);

  const isOpening = phase === "opening";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120]",
        isOpening ? "pointer-events-none overflow-visible bg-transparent" : "overflow-hidden bg-background",
      )}
      aria-hidden={!hold}
      role={hold ? "status" : undefined}
      aria-live={hold ? "polite" : undefined}
    >
      <div
        className="relative size-full"
        style={{ perspective: "1600px", perspectiveOrigin: "left center" }}
      >
        <motion.div
          className="absolute inset-0 origin-left flex will-change-transform flex-col items-center justify-center bg-background px-8"
          initial={false}
          animate={
            isOpening
              ? { rotateY: -102, x: "-10%", scale: 0.97 }
              : { rotateY: 0, x: "0%", scale: 1 }
          }
          transition={{
            duration: OPEN_MS / 1000,
            ease: EASE_OPEN,
          }}
          style={{
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative flex w-full max-w-xs flex-col items-center sm:max-w-sm md:max-w-md">
            <div className={reduceMotion || isOpening ? undefined : "light-sweep"}>
              <BrandLogo variant="dark" priority className="w-full" />
            </div>

            <div className="mt-12 w-40 overflow-hidden sm:w-52" aria-hidden="true">
              <div className="h-px w-full bg-border">
                <motion.div
                  className="h-px bg-brand-clay"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 1.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
            </div>

            <p className="mt-6 text-center text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
              {MESSAGE}
            </p>
          </div>

          {/* Sombra na lombada — tom suave sobre creme */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-brand-navy/20 via-brand-navy/5 to-transparent md:w-[16%]"
            animate={{ opacity: isOpening ? 0.95 : 0.35 }}
            transition={{ duration: isOpening ? 0.55 : 0.35, ease: EASE_OPEN }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-brand-cream/80 to-transparent"
            initial={false}
            animate={
              isOpening
                ? { opacity: [0, 0.55, 0], x: ["-30%", "55%", "110%"] }
                : { opacity: 0, x: "-30%" }
            }
            transition={{ duration: isOpening ? 1.15 : 0.25, ease: EASE_OPEN }}
          />
        </motion.div>
      </div>
    </div>
  );
}
