import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProductCard } from "@/components/cards/product-card";
import { CategoryRail } from "@/components/menu/category-rail";
import { FilterBar } from "@/components/menu/filter-bar";
import { SearchField } from "@/components/menu/search-field";
import { ProductDialog } from "@/components/menu/product-dialog";
import {
  ListView,
  ViewModeToggle,
  useMenuViewMode,
} from "@/components/menu/list-view";
import { StateMessage } from "@/components/common/state-message";
import { CategoryRailSkeleton, ProductGridSkeleton } from "@/components/loading/skeletons";
import { useCatalog } from "@/hooks/use-catalog";
import {
  defaultFilters,
  priceBounds,
  useFilteredProducts,
  useGroupedProducts,
  type MenuFilters,
} from "@/hooks/use-menu-filters";
import type { Product } from "@/types/catalog";

interface MenuBrowserProps {
  categorySlug?: string;
}

export function MenuBrowser({ categorySlug }: MenuBrowserProps) {
  const { data, isPending, isError, refetch } = useCatalog();
  const [filters, setFilters] = useState<MenuFilters>(defaultFilters);
  const [selected, setSelected] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useMenuViewMode();
  const reduceMotion = useReducedMotion();

  const activeFilters: MenuFilters = { ...filters, categorySlug: categorySlug ?? null };
  const products = useFilteredProducts(data?.products, activeFilters);
  const groups = useGroupedProducts(products);
  const bounds = priceBounds(data?.products);

  const patch = (next: Partial<MenuFilters>) => setFilters((prev) => ({ ...prev, ...next }));

  const category = data?.categories.find((item) => item.slug === categorySlug);

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
        {isPending ? (
          <CategoryRailSkeleton />
        ) : (
          <CategoryRail categories={data?.categories ?? []} activeSlug={categorySlug ?? null} />
        )}
        {!isPending && data ? (
          <>
            <FilterBar filters={activeFilters} onChange={patch} bounds={bounds} />
            <div className="flex justify-end">
              <ViewModeToggle value={viewMode} onChange={setViewMode} />
            </div>
          </>
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewMode}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {viewMode === "cards" ? (
                <div className="space-y-16">
                  {groups.map((group) => (
                    <section key={group.slug} aria-labelledby={`grupo-${group.slug}`}>
                      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                        <h2
                          id={`grupo-${group.slug}`}
                          className="font-display text-2xl text-foreground sm:text-3xl"
                        >
                          {group.name}
                        </h2>
                        {!categorySlug ? (
                          <Link
                            to="/menu/$categoria"
                            params={{ categoria: group.slug }}
                            className="shrink-0 text-[0.62rem] tracking-[0.18em] text-brand-clay uppercase underline-offset-4 hover:underline"
                          >
                            Ver categoria
                          </Link>
                        ) : (
                          <span className="shrink-0 text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
                            {group.products.length} itens
                          </span>
                        )}
                      </div>
                      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {group.products.map((product, index) => (
                          <li key={product.id}>
                            <ProductCard product={product} index={index} onSelect={setSelected} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <ListView groups={groups} onSelect={setSelected} />
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
