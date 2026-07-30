import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";

interface OpeningMenuTransitionProps {
  active: boolean;
  coverSrc?: string;
  onFinished?: () => void;
}

/**
 * Simula a abertura física do cardápio em perspectiva 3D.
 * Se a capa oficial não existir no caminho informado, usa fallback da marca.
 */
export function OpeningMenuTransition({
  active,
  coverSrc = "/menu-cover.png",
  onFinished,
}: OpeningMenuTransitionProps) {
  const reduceMotion = useReducedMotion();
  const [coverUnavailable, setCoverUnavailable] = useState(false);

  const exitTiming = useMemo(
    () => ({ duration: reduceMotion ? 0.2 : 1.45, ease: [0.22, 0.61, 0.36, 1] as const }),
    [reduceMotion],
  );

  return (
    <AnimatePresence mode="wait" onExitComplete={onFinished}>
      {active ? (
        <motion.div
          key="opening-menu-transition"
          className="fixed inset-0 z-[120] overflow-hidden bg-brand-navy"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: reduceMotion ? 0.15 : 0.38,
              delay: reduceMotion ? 0 : 1.02,
            },
          }}
          aria-hidden="true"
        >
          <div className="relative size-full [perspective:1800px] [transform-style:preserve-3d]">
            <motion.div
              className="absolute inset-0 origin-left will-change-transform"
              initial={false}
              animate={{ rotateY: 0, x: "0%", scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: exitTiming }
                  : {
                      rotateY: -106,
                      x: "-14%",
                      scale: 0.972,
                      transition: exitTiming,
                    }
              }
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              {coverUnavailable ? (
                <div className="flex size-full items-center justify-center bg-brand-navy px-10">
                  <BrandLogo variant="light" priority className="w-full max-w-xl" />
                </div>
              ) : (
                <img
                  src={coverSrc}
                  alt=""
                  className="size-full object-cover"
                  decoding="sync"
                  loading="eager"
                  fetchPriority="high"
                  onError={() => setCoverUnavailable(true)}
                />
              )}

              <motion.div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(88deg,rgba(9,23,45,0.52)_0%,rgba(9,23,45,0.22)_24%,rgba(9,23,45,0.06)_44%,rgba(9,23,45,0)_65%)]"
                initial={{ opacity: 0.16 }}
                animate={{ opacity: 0.16 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: [0.14, 0.44, 0],
                        transition: exitTiming,
                      }
                }
              />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(98deg,rgba(8,19,39,0)_34%,rgba(8,19,39,0.42)_58%,rgba(8,19,39,0)_82%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: [0, 0.46, 0],
                      transition: exitTiming,
                    }
              }
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
