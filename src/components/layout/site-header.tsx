import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import { useOpeningTransitionActive } from "@/components/loading/opening-transition-context";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/menu", label: "Cardápio" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

const REVEAL_MS = 0.55;
const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;
/** Altura fixa do header — o layout compensa com padding, nunca com spacer animado. */
export const HEADER_HEIGHT = "4.25rem";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const introActive = useOpeningTransitionActive();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = introActive;

  return (
    /*
     * Overlay fixo fora do fluxo: durante a intro o header inteiro (fundo,
     * borda e conteúdo) fica invisível — a capa revela apenas o hero por
     * baixo. Ele se materializa após a abertura, sem nenhum reflow.
     */
    <motion.header
      data-site-header
      initial={false}
      animate={hidden ? { opacity: 0 } : { opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: REVEAL_MS, ease: REVEAL_EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-[4.25rem] border-b bg-background transition-[background-color] duration-300",
        hidden ? "pointer-events-none border-transparent" : "border-border",
        scrolled && !hidden && "bg-background/90 backdrop-blur-md",
      )}
      aria-hidden={hidden || undefined}
    >
      <motion.div
        initial={false}
        animate={hidden ? { y: -14, filter: "blur(10px)" } : { y: 0, filter: "blur(0px)" }}
        transition={reduceMotion ? { duration: 0 } : { duration: REVEAL_MS, ease: REVEAL_EASE }}
        className="mx-auto grid h-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6"
      >
        <Link to="/" aria-label="Rayol Bistrô Terra & Mar — início" className="min-w-0">
          <BrandLogo variant="dark" priority className="w-36 sm:w-44" />
        </Link>

        <nav aria-label="Navegação principal" className="shrink-0">
          <ul className="scroll-rail flex items-center gap-1 sm:gap-2">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="inline-flex min-h-9 items-center rounded-full px-3 text-[0.68rem] tracking-[0.16em] whitespace-nowrap text-muted-foreground uppercase transition-colors hover:text-foreground data-[status=active]:text-brand-clay"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </motion.header>
  );
}
