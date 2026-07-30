import { Link, useRouterState } from "@tanstack/react-router";
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

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const opening = useOpeningTransitionActive();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "z-50 border-b transition-[colors,opacity] duration-500",
        pathname === "/" ? "fixed inset-x-0 top-0" : "sticky top-0",
        opening && "pointer-events-none opacity-0",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md"
          : overHero
            ? "border-transparent bg-transparent"
            : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" aria-label="Rayol Bistrô Terra & Mar — início" className="min-w-0">
          <BrandLogo
            variant={overHero ? "light" : "dark"}
            priority
            className="w-36 sm:w-44"
          />
        </Link>

        <nav aria-label="Navegação principal" className="shrink-0">
          <ul className="scroll-rail flex items-center gap-1 sm:gap-2">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-full px-3 text-[0.68rem] tracking-[0.16em] whitespace-nowrap uppercase transition-colors",
                    overHero
                      ? "text-background/75 hover:text-background data-[status=active]:text-background"
                      : "text-muted-foreground hover:text-foreground data-[status=active]:text-brand-clay",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
