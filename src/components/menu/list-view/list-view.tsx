import type { Product } from "@/types/catalog";
import type { ProductGroup } from "@/hooks/use-menu-filters";
import { CATEGORY_SECTION_SCROLL_MARGIN } from "@/hooks/use-category-scroll-spy";
import { ListCategory } from "@/components/menu/list-view/list-category";
import { ListDivider } from "@/components/menu/list-view/list-divider";
import { ListFooter } from "@/components/menu/list-view/list-footer";
import { ListItem } from "@/components/menu/list-view/list-item";
import { cn } from "@/lib/utils";

interface ListViewProps {
  groups: ProductGroup[];
  onSelect: (product: Product) => void;
  setSectionRef: (slug: string, element: HTMLElement | null) => void;
}

export function ListView({ groups, onSelect, setSectionRef }: ListViewProps) {
  return (
    <div>
      <div className="space-y-14">
        {groups.map((group) => {
          const headingId = `lista-grupo-${group.slug}`;
          return (
            <section
              key={group.slug}
              ref={(node) => setSectionRef(group.slug, node)}
              data-category-slug={group.slug}
              aria-labelledby={headingId}
              className={cn(CATEGORY_SECTION_SCROLL_MARGIN)}
            >
              <ListCategory id={headingId} name={group.name} />
              <ul className="mt-2">
                {group.products.map((product, index) => (
                  <li key={product.id}>
                    {index > 0 ? <ListDivider /> : null}
                    <ListItem product={product} onSelect={onSelect} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <ListFooter />
    </div>
  );
}
