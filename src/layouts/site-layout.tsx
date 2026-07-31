import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      {/* Header é overlay fixo (h-4.25rem) — o padding compensa; a home anula com -mt para o hero correr por baixo */}
      <main className="flex-1 pt-[4.25rem]">{children}</main>
      <SiteFooter />
    </div>
  );
}
