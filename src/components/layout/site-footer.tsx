import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/common/brand-logo";
import { RESTAURANT } from "@/constants/restaurant";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3">
        <div>
          <BrandLogo variant="light" className="w-44" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            {RESTAURANT.shortDescription}
          </p>
        </div>

        <div>
          <h2 className="text-[0.62rem] tracking-[0.24em] text-primary-foreground/60 uppercase">
            Horários
          </h2>
          <ul className="mt-5 space-y-2 text-sm text-primary-foreground/85">
            {RESTAURANT.hours.map((entry) => (
              <li key={entry.days} className="flex justify-between gap-6">
                <span>{entry.days}</span>
                <span className="text-primary-foreground/65">{entry.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.62rem] tracking-[0.24em] text-primary-foreground/60 uppercase">
            Visite
          </h2>
          <address className="mt-5 space-y-2 text-sm not-italic text-primary-foreground/85">
            <p>{RESTAURANT.address}</p>
            <p>{RESTAURANT.phone}</p>
            <a
              href={RESTAURANT.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block underline-offset-4 hover:underline"
            >
              {RESTAURANT.instagram}
            </a>
          </address>
          <Link
            to="/contato"
            className="mt-7 inline-flex min-h-11 items-center rounded-full border border-primary-foreground/30 px-6 text-xs tracking-[0.16em] uppercase transition-colors hover:bg-primary-foreground/10"
          >
            Reservar mesa
          </Link>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 px-4 py-6 text-center text-[0.65rem] tracking-[0.18em] text-primary-foreground/50 uppercase sm:px-6">
        © {new Date().getFullYear()} {RESTAURANT.fullName}
      </div>
    </footer>
  );
}
