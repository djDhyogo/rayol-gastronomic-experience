
import type { Product } from "@/types/catalog";
import heroImage from "@/assets/hero-terra-mar.jpg";
import barImage from "@/assets/interior-bistro.jpg";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const DRINK_SLUGS = new Set(["drinks", "bebidas", "happy-hour"]);

function coverFor(product: Product) {
  return DRINK_SLUGS.has(product.categorySlug) ? barImage : heroImage;
}

function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary sm:aspect-[2/1]">
        <img
          src={coverFor(product)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy/45" />
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-6xl text-background/90"
        >
          {product.name.trim().charAt(0).toLocaleUpperCase("pt-BR")}
        </span>
      </div>

      <div className="px-6 pt-6 pb-8 sm:px-8">
        <p className="eyebrow">{product.categoryName}</p>
        <h2 className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">
          {product.name}
        </h2>

        {product.badges.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-brand-clay/30 px-3 py-1 text-[0.62rem] tracking-[0.16em] text-brand-clay uppercase"
              >
                {badge}
              </li>
            ))}
          </ul>
        ) : null}

        {product.description ? (
          <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Peça ao nosso time mais detalhes sobre este item.
          </p>
        )}

        <div className="mt-7 flex items-end justify-between border-t border-border pt-5">
          <div>
            <p className="text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">Valor</p>
            <p className="mt-1 font-display text-2xl text-brand-clay">{product.priceLabel}</p>
          </div>
          {product.code ? (
            <p className="text-right text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
              Código
              <span className="mt-1 block font-sans text-sm tracking-normal text-foreground normal-case">
                {product.code}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface ProductDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDialog({ product, onClose }: ProductDialogProps) {
  const isMobile = useIsMobile();
  const open = Boolean(product);

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[92dvh] overflow-y-auto bg-card p-0">
          {product ? (
            <>
              <DrawerTitle className="sr-only">{product.name}</DrawerTitle>
              <ProductDetail product={product} />
              <div className="sticky bottom-0 border-t border-border bg-card px-6 py-4">
                <DrawerClose className="min-h-11 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground">
                  Fechar
                </DrawerClose>
              </div>
            </>
          ) : null}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[min(46rem,92vw)] gap-0 overflow-y-auto rounded-lg border-border bg-card p-0 [&>button:last-child]:z-10 [&>button:last-child]:grid [&>button:last-child]:size-10 [&>button:last-child]:place-items-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-card/90 [&>button:last-child]:opacity-100 sm:max-w-2xl">
        {product ? (
          <>
            <DialogTitle className="sr-only">{product.name}</DialogTitle>
            <ProductDetail product={product} />
          </>
        ) : null}

      </DialogContent>
    </Dialog>
  );
}

export { ProductDetail };
