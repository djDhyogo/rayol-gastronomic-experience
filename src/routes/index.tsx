import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-terra-mar.jpg";
import interiorImage from "@/assets/interior-bistro.jpg";
import { BrandLogo } from "@/components/common/brand-logo";
import { ProductCard } from "@/components/cards/product-card";
import { ProductDialog } from "@/components/menu/product-dialog";
import { ProductGridSkeleton } from "@/components/loading/skeletons";
import { useCatalog } from "@/hooks/use-catalog";
import { useHighlights } from "@/hooks/use-highlights";
import { RESTAURANT } from "@/constants/restaurant";
import type { Product } from "@/types/catalog";
import { useState } from "react";

const title = `${RESTAURANT.fullName} — Cozinha de mar e terra`;
const description =
  "Bistrô contemporâneo em Barra do Sahy. Cardápio digital com pratos de mar e terra, drinks autorais, happy hour e sobremesas.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: RESTAURANT.fullName,
          description,
          servesCuisine: ["Frutos do mar", "Contemporânea brasileira"],
          address: RESTAURANT.address,
          telephone: RESTAURANT.phone,
          hasMenu: "/menu",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data, isPending } = useCatalog();
  const highlights = useHighlights(data);
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <section className="relative isolate -mt-[4.25rem] min-h-dvh overflow-hidden">
        <img
          src={heroImage}
          alt="Prato de frutos do mar servido no Rayol Bistrô Terra & Mar"
          className="absolute inset-0 -z-10 size-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-brand-navy/70" />

        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-4 pt-[4.25rem] pb-16 text-center sm:px-6 sm:pb-24 md:items-start md:text-left">
          <BrandLogo variant="light" priority className="w-52 sm:w-72" />
          <h1 className="mt-10 max-w-2xl font-display text-4xl leading-[1.05] text-background sm:text-6xl">
            Cozinha terra e mar
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-background/80 sm:text-base">
            {RESTAURANT.shortDescription} Explore o cardápio completo, com preços sempre
            atualizados.
          </p>
          <Link
            to="/menu"
            className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-background px-7 text-xs tracking-[0.18em] text-foreground uppercase transition-transform hover:-translate-y-0.5"
          >
            Ver cardápio
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        {isPending ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <div className="space-y-20">
            {highlights.map((highlight) => (
              <div key={highlight.id}>
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="eyebrow">{highlight.subtitle}</p>
                    <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
                      {highlight.title}
                    </h2>
                  </div>
                  <Link
                    to="/menu"
                    className="hidden shrink-0 text-[0.62rem] tracking-[0.18em] text-brand-clay uppercase underline-offset-4 hover:underline sm:inline"
                  >
                    Ver tudo
                  </Link>
                </div>
                <ul className="scroll-rail mt-8 -mx-4 flex gap-4 px-4 pb-2">
                  {highlight.products.map((product, index) => (
                    <li key={product.id} className="flex">
                      <ProductCard
                        product={product}
                        index={index}
                        compact
                        disableEntranceAnimation
                        onSelect={setSelected}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 sm:py-28">
          <div className="overflow-hidden rounded-lg">
            <img
              src={interiorImage}
              alt="Salão do Rayol Bistrô com iluminação quente e mesas postas"
              loading="lazy"
              className="aspect-[4/3] size-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Nossa casa</p>
            <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">
              Hospitalidade litorânea, técnica contemporânea
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Trabalhamos com pescado fresco do litoral norte e ingredientes de pequenos produtores
              da serra. Cada prato nasce do encontro entre o mar e a terra — a origem do nosso nome.
            </p>
            <Link
              to="/sobre"
              className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-full border border-brand-navy/25 px-6 text-xs tracking-[0.18em] text-foreground uppercase transition-colors hover:bg-card"
            >
              Conheça o bistrô
            </Link>
          </div>
        </div>
      </section>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
