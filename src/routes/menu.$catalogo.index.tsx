import { createFileRoute } from "@tanstack/react-router";
import { RESTAURANT } from "@/constants/restaurant";
import { menuHref } from "@/lib/menu-search";
import { toTitleCase } from "@/utils/format";

export const Route = createFileRoute("/menu/$catalogo/")({
  head: ({ params }) => {
    const label = toTitleCase(params.catalogo.replace(/-/g, " "));
    const title = `${label} — ${RESTAURANT.fullName}`;
    const description = `Cardápio ${label} do ${RESTAURANT.fullName}, com descrições e preços atualizados.`;
    const href = menuHref(params.catalogo);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: href },
      ],
      links: [{ rel: "canonical", href }],
    };
  },
  component: CatalogPage,
});

function CatalogPage() {
  return null;
}
