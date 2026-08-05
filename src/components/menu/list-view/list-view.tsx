import type { Product } from "@/types/catalog";
import type { ProductGroup } from "@/hooks/use-menu-filters";
import { ListCategory } from "@/components/menu/list-view/list-category";
import { ListDivider } from "@/components/menu/list-view/list-divider";
import { ListFooter } from "@/components/menu/list-view/list-footer";
import { ListItem } from "@/components/menu/list-view/list-item";

interface ListViewProps {
  groups: ProductGroup[];
  onSelect: (product: Product) => void;
}

export function ListView({ groups, onSelect }: ListViewProps) {
  return (
    <div>
      <div className="space-y-14">
        {groups.map((group) => {
          const headingId = `lista-grupo-${group.slug}`;
          return (
            <section key={group.slug} aria-labelledby={headingId}>
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
