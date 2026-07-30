import { createFileRoute } from "@tanstack/react-router";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { RESTAURANT } from "@/constants/restaurant";
import { toTitleCase } from "@/utils/format";

export const Route = createFileRoute("/menu/$categoria")({
  head: ({ params }) => {
    const label = toTitleCase(params.categoria.replace(/-/g, " "));
    const title = `${label} — ${RESTAURANT.fullName}`;
    const description = `Itens da categoria ${label} no cardápio do ${RESTAURANT.fullName}, com descrições e preços atualizados.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/menu/${params.categoria}` },
      ],
      links: [{ rel: "canonical", href: `/menu/${params.categoria}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { categoria } = Route.useParams();
  return <MenuBrowser categorySlug={categoria} />;
}
