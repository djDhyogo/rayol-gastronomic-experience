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

/**
 * Intro só com CSS + logo (sem capa fotográfica).
 * Hold navy → abertura 3D da “página” → site por trás.
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
        isOpening ? "pointer-events-none overflow-visible bg-transparent" : "overflow-hidden bg-brand-navy",
      )}
      aria-hidden="true"
    >
      <div
        className="relative size-full"
        style={{ perspective: "1600px", perspectiveOrigin: "left center" }}
      >
        <motion.div
          className="absolute inset-0 origin-left flex will-change-transform items-center justify-center bg-brand-navy px-8"
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
          {/* Textura CSS — leve vinheta, sem foto */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.38_0.07_258)_0%,transparent_65%)] opacity-40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35"
            aria-hidden
          />

          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className={reduceMotion ? undefined : "light-sweep"}>
              <BrandLogo variant="light" priority className="w-full" />
            </div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-black/50 via-brand-navy/30 to-transparent md:w-[18%]"
            animate={{ opacity: isOpening ? 0.9 : 0.25 }}
            transition={{ duration: isOpening ? 0.55 : 0.35, ease: EASE_OPEN }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            initial={false}
            animate={
              isOpening
                ? { opacity: [0, 0.4, 0], x: ["-30%", "55%", "110%"] }
                : { opacity: 0, x: "-30%" }
            }
            transition={{ duration: isOpening ? 1.15 : 0.25, ease: EASE_OPEN }}
          />
        </motion.div>
      </div>
    </div>
  );
}
