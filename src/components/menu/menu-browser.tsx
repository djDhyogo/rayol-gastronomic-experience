import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { CategoryRail } from "@/components/menu/category-rail";
import { FilterBar } from "@/components/menu/filter-bar";
import { SearchField } from "@/components/menu/search-field";
import { ProductDialog } from "@/components/menu/product-dialog";
import { ViewModeToggle, useMenuViewMode } from "@/components/menu/list-view";
import { ListCategory } from "@/components/menu/list-view/list-category";
import { ListDivider } from "@/components/menu/list-view/list-divider";
import { ListFooter } from "@/components/menu/list-view/list-footer";
import { ListItem } from "@/components/menu/list-view/list-item";
import { StateMessage } from "@/components/common/state-message";
import { CategoryRailSkeleton, ProductGridSkeleton } from "@/components/loading/skeletons";
import { useCatalog } from "@/hooks/use-catalog";
import {
  CATEGORY_SECTION_SCROLL_MARGIN,
  useCategoryScrollSpy,
} from "@/hooks/use-category-scroll-spy";
import {
  defaultFilters,
  priceBounds,
  useFilteredProducts,
  useGroupedProducts,
  type MenuFilters,
} from "@/hooks/use-menu-filters";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/catalog";

interface MenuBrowserProps {
  categorySlug?: string;
}

export function MenuBrowser({ categorySlug }: MenuBrowserProps) {
  const { data, isPending, isError, refetch } = useCatalog();
  const [filters, setFilters] = useState<MenuFilters>(defaultFilters);
  const [selected, setSelected] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useMenuViewMode();

  // ScrollSpy indexa o cardápio completo — não filtra por rota de categoria
  const activeFilters: MenuFilters = { ...filters, categorySlug: null };
  const products = useFilteredProducts(data?.products, activeFilters);
  const groups = useGroupedProducts(products);
  const bounds = priceBounds(data?.products);
  const sectionSlugs = useMemo(() => groups.map((group) => group.slug), [groups]);

  const { activeSlug, setSectionRef, setRailItemRef, scrollToCategory, pinCategory } =
    useCategoryScrollSpy(sectionSlugs);

  const patch = (next: Partial<MenuFilters>) => setFilters((prev) => ({ ...prev, ...next }));

  const catalogCategories: Category[] = data?.categories ?? [];
  const category = categorySlug
    ? catalogCategories.find((item) => item.slug === categorySlug)
    : undefined;
  const railCategories = catalogCategories.filter((item) => sectionSlugs.includes(item.slug));

  /** Após trocar Lista ↔ Fotos, realinha o scroll no início da mesma seção (seções permanecem). */
  const pendingViewRestore = useRef<string | null | undefined>(undefined);

  const handleViewModeChange = (next: typeof viewMode) => {
    if (next === viewMode) return;
    pendingViewRestore.current = activeSlug;
    pinCategory(activeSlug);
    setViewMode(next);
  };

  useLayoutEffect(() => {
    const slug = pendingViewRestore.current;
    if (slug === undefined) return;
    pendingViewRestore.current = undefined;
    scrollToCategory(slug, { behavior: "auto" });
  }, [viewMode, scrollToCategory]);

  // Deep link /menu/:categoria → rola até a seção uma vez após carregar
  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (!categorySlug || isPending || sectionSlugs.length === 0) return;
    if (!sectionSlugs.includes(categorySlug)) return;
    if (didInitialScroll.current) return;
    didInitialScroll.current = true;

    const frame = window.requestAnimationFrame(() => {
      scrollToCategory(categorySlug);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [categorySlug, isPending, sectionSlugs, scrollToCategory]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="max-w-2xl">
        <p className="eyebrow">{category ? category.name : "Cardápio completo"}</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-5xl">
          {category ? category.name : "Nosso cardápio"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Pratos de mar e terra preparados diariamente. Toque em qualquer item para ver a descrição
          completa.
        </p>
      </header>

      <div className="mt-9 flex flex-col gap-5">
        <SearchField
          value={filters.search}
          onChange={(search) => patch({ search })}
          resultCount={products.length}
        />

        {!isPending && data ? (
          <FilterBar filters={activeFilters} onChange={patch} bounds={bounds} />
        ) : null}
      </div>

      {/* Pai comum: sticky precisa envolver a lista para permanecer fixo durante a rolagem */}
      <div className="mt-5">
        <div
          data-category-sticky
          className="sticky top-[4.25rem] z-40 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
        >
          {isPending ? (
            <CategoryRailSkeleton />
          ) : (
            <CategoryRail
              categories={railCategories}
              activeSlug={activeSlug}
              onSelectCategory={scrollToCategory}
              setRailItemRef={setRailItemRef}
            />
          )}

          {!isPending && data ? (
            <div className="mt-3 flex justify-end">
              <ViewModeToggle value={viewMode} onChange={handleViewModeChange} />
            </div>
          ) : null}
        </div>

        <div className="mt-12">
          {isPending ? <ProductGridSkeleton count={9} /> : null}

          {isError ? (
            <StateMessage
              variant="error"
              title="Não conseguimos carregar o cardápio"
              description="Verifique sua conexão e tente novamente em alguns instantes."
              actionLabel="Tentar novamente"
              onAction={() => refetch()}
            />
          ) : null}

          {!isPending && !isError && products.length === 0 ? (
            <StateMessage
              variant="empty"
              title="Nenhum item encontrado"
              description="Ajuste a busca ou os filtros para ver outras opções do cardápio."
              actionLabel="Limpar filtros"
              onAction={() => setFilters(defaultFilters)}
            />
          ) : null}

          {!isPending && !isError && products.length > 0 ? (
            <div>
              {/*
                Seções estáveis: só o miolo troca (lista/cards).
                Evita remount que quebrava o foco ao alternar o modo.
              */}
              <div className={cn(viewMode === "list" ? "space-y-14" : "space-y-16")}>
                {groups.map((group) => {
                  const headingId =
                    viewMode === "list" ? `lista-grupo-${group.slug}` : `grupo-${group.slug}`;

                  return (
                    <section
                      key={group.slug}
                      ref={(node) => setSectionRef(group.slug, node)}
                      data-category-slug={group.slug}
                      aria-labelledby={headingId}
                      className={CATEGORY_SECTION_SCROLL_MARGIN}
                    >
                      {viewMode === "list" ? (
                        <ListCategory id={headingId} name={group.name} />
                      ) : (
                        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                          <h2
                            id={headingId}
                            className="font-display text-2xl text-foreground sm:text-3xl"
                          >
                            {group.name}
                          </h2>
                          <button
                            type="button"
                            onClick={() => scrollToCategory(group.slug)}
                            className="shrink-0 text-[0.62rem] tracking-[0.18em] text-brand-clay uppercase underline-offset-4 hover:underline"
                          >
                            Ver categoria
                          </button>
                        </div>
                      )}

                      {viewMode === "list" ? (
                        <ul className="mt-2">
                          {group.products.map((product, index) => (
                            <li key={product.id}>
                              {index > 0 ? <ListDivider /> : null}
                              <ListItem product={product} onSelect={setSelected} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {group.products.map((product, index) => (
                            <li key={product.id}>
                              <ProductCard
                                product={product}
                                index={index}
                                disableEntranceAnimation
                                onSelect={setSelected}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>

              {viewMode === "list" ? <ListFooter /> : null}
            </div>
          ) : null}
        </div>
      </div>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
