import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { useOpeningTransitionActive } from "@/components/loading/opening-transition-context";
import { cn } from "@/lib/utils";

export function SiteLayout({ children }: { children: ReactNode }) {
  const opening = useOpeningTransitionActive();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <div
        className={cn(
          "transition-opacity duration-500",
          opening && "pointer-events-none opacity-0",
        )}
      >
        <SiteFooter />
      </div>
    </div>
  );
}
