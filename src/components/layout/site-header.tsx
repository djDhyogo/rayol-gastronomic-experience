import { Link } from "@tanstack/react-router";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background transition-[background-color,opacity] duration-300",
        scrolled && "bg-background/90 backdrop-blur-md",
        opening && "pointer-events-none opacity-0",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
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
      </div>
    </header>
  );
}
