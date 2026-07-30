import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";

interface BrandLoadingScreenProps {
  /** Enquanto true a tela permanece visível. */
  active: boolean;
  onFinished?: () => void;
}

const MESSAGES = [
  "Preparando uma experiência gastronômica...",
  "Selecionando os pratos do dia...",
];

export function BrandLoadingScreen({ active, onFinished }: BrandLoadingScreenProps) {
  const reduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const timer = window.setInterval(
      () => setMessageIndex((index) => (index + 1) % MESSAGES.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, [active, reduceMotion]);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {active ? (
        <motion.div
          key="brand-loading"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.015 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            className="w-full max-w-xs sm:max-w-sm"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [0.98, 1, 0.995, 1] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: 1.1, ease: "easeOut" },
                    scale: { duration: 6, times: [0, 0.18, 0.6, 1], ease: "easeInOut", repeat: Infinity },
                  }
            }
          >
            <div className={reduceMotion ? undefined : "light-sweep"}>
              <BrandLogo priority className="w-full" />
            </div>
          </motion.div>

          <div className="mt-12 w-40 overflow-hidden sm:w-52" aria-hidden="true">
            <div className="h-px w-full bg-border">
              <motion.div
                className="h-px bg-brand-clay"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: reduceMotion ? 0.2 : 4.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </div>

          <div className="mt-6 h-5 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5 }}
                className="text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase"
              >
                {MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
