import { createFileRoute, Link } from "@tanstack/react-router";
import interiorImage from "@/assets/interior-bistro.jpg";
import { RESTAURANT } from "@/constants/restaurant";

const title = `Sobre — ${RESTAURANT.fullName}`;
const description =
  "A história do Rayol Bistrô Terra & Mar: pescado fresco do litoral norte, produtores da serra e uma cozinha contemporânea em Barra do Sahy.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">Sobre nós</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
        Entre o mar e a terra
      </h1>

      <img
        src={interiorImage}
        alt="Ambiente interno do Rayol Bistrô Terra & Mar"
        loading="lazy"
        className="mt-10 aspect-[16/9] w-full rounded-lg object-cover"
      />

      <div className="mt-12 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          O {RESTAURANT.fullName} nasceu do desejo de traduzir o litoral norte paulista em um menu
          honesto. Do mar vem o pescado do dia, comprado direto dos barcos de Barra do Sahy. Da
          terra vêm as hortaliças, queijos e carnes de pequenos produtores da serra.
        </p>
        <p>
          A cozinha é contemporânea, mas sem excessos: técnica a serviço do ingrediente. O salão foi
          pensado para o ritmo da praia — pé na areia no almoço, luz baixa e drinks autorais à
          noite.
        </p>
        <p>
          Nosso cardápio muda com a temporada e com o que chega fresco. Por isso este cardápio
          digital é atualizado automaticamente: o que você vê aqui é o que está sendo servido hoje.
        </p>
      </div>

      <dl className="mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
        <div>
          <dt className="eyebrow">Endereço</dt>
          <dd className="mt-3 text-sm text-foreground">{RESTAURANT.address}</dd>
        </div>
        <div>
          <dt className="eyebrow">Horários</dt>
          <dd className="mt-3 space-y-1 text-sm text-foreground">
            {RESTAURANT.hours.map((entry) => (
              <p key={entry.days}>
                {entry.days} — {entry.time}
              </p>
            ))}
          </dd>
        </div>
      </dl>

      <Link
        to="/menu"
        className="mt-12 inline-flex min-h-11 items-center rounded-full bg-primary px-7 text-xs tracking-[0.18em] text-primary-foreground uppercase"
      >
        Ver cardápio
      </Link>
    </article>
  );
}
