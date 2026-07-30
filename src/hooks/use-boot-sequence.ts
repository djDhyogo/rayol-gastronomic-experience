import { useEffect, useState } from "react";

const MIN_DURATION = 2000;

/**
 * Hold da capa: dura no mínimo MIN_DURATION e espera o catálogo.
 * A animação de abertura em si é controlada pelo overlay (onFinished).
 */
export function useBootSequence(ready: boolean) {
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinElapsed(true), MIN_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  /** true = manter capa fechada; false = pode iniciar o efeito de abertura */
  const holdCover = !(ready && minElapsed);

  return { holdCover };
}
