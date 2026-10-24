import { Outlet, createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { MenuBrowser } from "@/components/menu/menu-browser";

export const Route = createFileRoute("/menu/$catalogo")({
  beforeLoad: ({ params, search, location }) => {
    const fromQuery = search.catalog_slug;
    if (!fromQuery) return;
    if (fromQuery !== params.catalogo) {
      throw redirect({
        to: "/menu/$catalogo/$categoria",
        params: { catalogo: fromQuery, categoria: params.catalogo },
        replace: true,
      });
    }
    throw redirect({ href: location.pathname, replace: true });
  },
  component: CatalogLayout,
});

function CatalogLayout() {
  const { catalogo } = Route.useParams();
  const { categoria } = useParams({ strict: false });
  const categorySlug = typeof categoria === "string" ? categoria : undefined;

  return (
    <>
      <MenuBrowser catalogSlug={catalogo} categorySlug={categorySlug} />
      <Outlet />
    </>
  );
}
