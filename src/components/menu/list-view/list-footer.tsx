import { RESTAURANT } from "@/constants/restaurant";

export function ListFooter() {
  return (
    <footer className="mt-16 space-y-5 pb-4 text-center">
      <p className="text-sm text-brand-navy">Cobramos taxa de 10%</p>
      <div className="rule-ornament mx-auto max-w-sm">
        <a
          href={RESTAURANT.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-sm tracking-wide text-muted-foreground underline-offset-4 hover:text-brand-clay hover:underline"
        >
          {RESTAURANT.instagram}
        </a>
      </div>
    </footer>
  );
}
