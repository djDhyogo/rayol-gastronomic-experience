import { useEffect, useState } from "react";

const STORAGE_KEY = "rayol:boot";
const MIN_DURATION = 2600;

/**
 * Controla a tela de entrada da marca: exibida apenas na primeira visita da
 * sessão, com duração mínima para a animação completar.
 */
export function useBootSequence(ready: boolean) {
  const [mounted, setMounted] = useState(false);
  const [seen, setSeen] = useState(true);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const alreadySeen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    setSeen(alreadySeen);
    if (alreadySeen) {
      setMinElapsed(true);
      return;
    }
    const timer = window.setTimeout(() => setMinElapsed(true), MIN_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = mounted && !seen && !(ready && minElapsed);

  useEffect(() => {
    if (mounted && !visible) window.sessionStorage.setItem(STORAGE_KEY, "1");
  }, [mounted, visible]);

  return { showBootScreen: visible };
}
