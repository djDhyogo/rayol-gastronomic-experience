import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { cn } from "@/lib/utils";

interface OpeningMenuTransitionProps {
  /** Enquanto true, a capa permanece fechada (hold). */
  hold: boolean;
  /** Capa mobile (retrato). */
  coverSrcMobile?: string;
  /** Capa desktop (paisagem). */
  coverSrcDesktop?: string;
  onFinished?: () => void;
}

const OPEN_MS = 1450;
const EASE_OPEN = [0.22, 0.61, 0.36, 1] as const;
const DESKTOP_MQ = "(min-width: 768px)";

function resolveCoverSrc(mobile: string, desktop: string) {
  if (typeof window === "undefined") return mobile;
  return window.matchMedia(DESKTOP_MQ).matches ? desktop : mobile;
}

/**
 * Única apresentação de entrada: hold da capa → abertura 3D → remove overlay.
 * Usa capa retrato no mobile e paisagem no desktop.
 */
export function OpeningMenuTransition({
  hold,
  coverSrcMobile = "/menu-cover.jpg",
  coverSrcDesktop = "/menu-cover-desktop.jpg",
  onFinished,
}: OpeningMenuTransitionProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"hold" | "opening">("hold");
  const [coverSrc, setCoverSrc] = useState(() =>
    resolveCoverSrc(coverSrcMobile, coverSrcDesktop),
  );
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [coverUnavailable, setCoverUnavailable] = useState(false);
  const openingStarted = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const sync = () => {
      const next = resolveCoverSrc(coverSrcMobile, coverSrcDesktop);
      setCoverSrc((prev) => {
        if (prev === next) return prev;
        setCoverLoaded(false);
        return next;
      });
    };
    sync();
    const mql = window.matchMedia(DESKTOP_MQ);
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, [coverSrcMobile, coverSrcDesktop]);

  useEffect(() => {
    const img = new Image();
    img.src = coverSrc;
    if (img.complete) {
      setCoverLoaded(true);
      return;
    }
    img.onload = () => setCoverLoaded(true);
    img.onerror = () => {
      setCoverUnavailable(true);
      setCoverLoaded(true);
    };
  }, [coverSrc]);

  useEffect(() => {
    if (hold) {
      openingStarted.current = false;
      finishedRef.current = false;
      setPhase("hold");
      return;
    }

    if (openingStarted.current || !coverLoaded) return;
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
  }, [hold, coverLoaded, reduceMotion]);

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
          className="absolute inset-0 origin-left will-change-transform bg-brand-navy"
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
          {coverUnavailable ? (
            <div className="flex size-full items-center justify-center bg-brand-navy px-10">
              <BrandLogo variant="light" priority className="w-full max-w-xl" />
            </div>
          ) : (
            <picture>
              <source media={DESKTOP_MQ} srcSet={coverSrcDesktop} />
              <img
                src={coverSrcMobile}
                alt=""
                className={cn(
                  "size-full object-cover object-center transition-opacity duration-300",
                  coverLoaded ? "opacity-100" : "opacity-0",
                )}
                decoding="sync"
                loading="eager"
                fetchPriority="high"
                draggable={false}
                onLoad={() => setCoverLoaded(true)}
                onError={() => {
                  setCoverUnavailable(true);
                  setCoverLoaded(true);
                }}
              />
            </picture>
          )}

          <motion.div
            className="pointer-events-none absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-black/50 via-brand-navy/25 to-transparent md:w-[18%]"
            animate={{ opacity: isOpening ? 0.85 : 0.22 }}
            transition={{ duration: isOpening ? 0.55 : 0.4, ease: EASE_OPEN }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={false}
            animate={
              isOpening
                ? { opacity: [0, 0.45, 0], x: ["-30%", "55%", "110%"] }
                : { opacity: 0, x: "-30%" }
            }
            transition={{ duration: isOpening ? 1.15 : 0.3, ease: EASE_OPEN }}
          />
        </motion.div>
      </div>
    </div>
  );
}
