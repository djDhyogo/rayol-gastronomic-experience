import { useEffect, useState } from "react";

const MIN_DURATION = 2200;

/**
 * Controla a tela de entrada da marca: executa em todo carregamento/reload,
 * com duração mínima para a animação completar e espera o catálogo estar pronto.
 * Não usa storage — cada F5 / visita nova dispara a abertura.
 */
export function useBootSequence(ready: boolean) {
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinElapsed(true), MIN_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  return { showBootScreen: !(ready && minElapsed) };
}
