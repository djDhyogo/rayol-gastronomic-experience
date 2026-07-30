import { createFileRoute } from "@tanstack/react-router";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { RESTAURANT } from "@/constants/restaurant";

const title = `Cardápio — ${RESTAURANT.fullName}`;
const description =
  "Cardápio completo do Rayol Bistrô Terra & Mar: entradas, pratos de mar e terra, sobremesas, drinks e happy hour com preços atualizados.";

export const Route = createFileRoute("/menu/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  return <MenuBrowser />;
}
