import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";

const HEADER_OFFSET_PX = 68; // 4.25rem — site header fixo
const FALLBACK_RAIL_PX = 180;
/** Folga entre a barra sticky e o título da seção */
const SECTION_GAP_PX = 16;
const CLICK_LOCK_MS = 1200;

export interface CategoryScrollSpyApi {
  activeSlug: string | null;
  setSectionRef: (slug: string, element: HTMLElement | null) => void;
  setRailItemRef: (slug: string, element: HTMLElement | null) => void;
  scrollToCategory: (
    slug: string | null,
    options?: { behavior?: ScrollBehavior },
  ) => void;
  /** Trava o spy e mantém a categoria (ex.: troca Lista ↔ Fotos). */
  pinCategory: (slug: string | null) => void;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Altura total a reservar: header do site + barra sticky de categorias. */
function measureScrollOffset(): number {
  const sticky = document.querySelector<HTMLElement>("[data-category-sticky]");
  const rail = sticky?.offsetHeight ?? FALLBACK_RAIL_PX;
  return HEADER_OFFSET_PX + rail + SECTION_GAP_PX;
}

/** Publica o offset em CSS para `scroll-margin-top` das seções. */
function syncScrollMarginVar() {
  const offset = measureScrollOffset();
  document.documentElement.style.setProperty("--category-scroll-offset", `${offset}px`);
  return offset;
}

/** Centraliza o chip só no trilho horizontal — nunca mexe no scroll da página. */
function centerInRail(item: HTMLElement, smooth: boolean) {
  const scroller = item.closest<HTMLElement>("[data-category-rail]");
  if (!scroller) return;

  const left = item.offsetLeft - (scroller.clientWidth - item.offsetWidth) / 2;
  scroller.scrollTo({
    left: Math.max(0, left),
    behavior: smooth ? "smooth" : "auto",
  });
}

/**
 * ScrollSpy de categorias via Intersection Observer.
 * Centraliza estado ativo, scroll suave até a seção e centralização na barra.
 */
export function useCategoryScrollSpy(sectionSlugs: string[]): CategoryScrollSpyApi {
  const [activeSlug, setActiveSlug] = useState<string | null>(sectionSlugs[0] ?? null);
  const sectionEls = useRef(new Map<string, HTMLElement>());
  const railItemEls = useRef(new Map<string, HTMLElement>());
  const ratios = useRef(new Map<string, number>());
  const clickLockUntil = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const slugsKey = sectionSlugs.join("|");
  const slugsRef = useRef(sectionSlugs);
  slugsRef.current = sectionSlugs;

  const centerRailItem = useCallback((slug: string | null, smooth = true) => {
    const key = slug ?? "all";
    const item = railItemEls.current.get(key);
    if (!item) return;
    centerInRail(item, smooth && !prefersReducedMotion());
  }, []);

  const pickActiveFromRatios = useEffectEvent(() => {
    if (Date.now() < clickLockUntil.current) return;

    let bestSlug: string | null = null;
    let bestRatio = 0;

    for (const slug of slugsRef.current) {
      const ratio = ratios.current.get(slug) ?? 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestSlug = slug;
      }
    }

    if (bestSlug) {
      setActiveSlug((prev) => (prev === bestSlug ? prev : bestSlug));
    }
  });

  const setSectionRef = useCallback((slug: string, element: HTMLElement | null) => {
    const prev = sectionEls.current.get(slug);
    if (prev && observerRef.current) observerRef.current.unobserve(prev);

    if (element) {
      sectionEls.current.set(slug, element);
      observerRef.current?.observe(element);
    } else {
      sectionEls.current.delete(slug);
      ratios.current.delete(slug);
    }
  }, []);

  const setRailItemRef = useCallback((slug: string, element: HTMLElement | null) => {
    if (element) railItemEls.current.set(slug, element);
    else railItemEls.current.delete(slug);
  }, []);

  const pinCategory = useCallback(
    (slug: string | null) => {
      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
      ratios.current.clear();
      setActiveSlug(slug);
      centerRailItem(slug, false);
    },
    [centerRailItem],
  );

  const scrollToCategory = useCallback(
    (slug: string | null, options?: { behavior?: ScrollBehavior }) => {
      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
      const behavior: ScrollBehavior =
        options?.behavior ?? (prefersReducedMotion() ? "auto" : "smooth");
      const offset = syncScrollMarginVar();

      if (slug === null) {
        setActiveSlug(null);
        centerRailItem("all");
        window.scrollTo({ top: 0, behavior });
        return;
      }

      setActiveSlug(slug);
      centerRailItem(slug, behavior === "smooth");

      const section = sectionEls.current.get(slug);
      if (!section) return;

      const top = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    },
    [centerRailItem],
  );

  // Mantém --category-scroll-offset alinhado à altura real da barra sticky
  useEffect(() => {
    syncScrollMarginVar();
    const sticky = document.querySelector("[data-category-sticky]");
    if (!sticky || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => syncScrollMarginVar());
    ro.observe(sticky);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (sectionSlugs.length === 0) {
      observerRef.current?.disconnect();
      observerRef.current = null;
      return;
    }

    const topOffset = measureScrollOffset();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const slug = (entry.target as HTMLElement).dataset.categorySlug;
          if (!slug) continue;
          ratios.current.set(slug, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        pickActiveFromRatios();
      },
      {
        root: null,
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    observerRef.current = observer;
    for (const slug of sectionSlugs) {
      const el = sectionEls.current.get(slug);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      if (observerRef.current === observer) observerRef.current = null;
    };
  }, [slugsKey, sectionSlugs, pickActiveFromRatios]);

  useEffect(() => {
    centerRailItem(activeSlug, true);
  }, [activeSlug, centerRailItem]);

  useEffect(() => {
    if (sectionSlugs.length === 0) {
      setActiveSlug(null);
      return;
    }
    setActiveSlug((prev) =>
      prev && sectionSlugs.includes(prev) ? prev : sectionSlugs[0],
    );
  }, [slugsKey, sectionSlugs]);

  return {
    activeSlug,
    setSectionRef,
    setRailItemRef,
    scrollToCategory,
    pinCategory,
  };
}

/** Usa a variável medida em runtime (header + sticky + folga). */
export const CATEGORY_SECTION_SCROLL_MARGIN =
  "scroll-mt-[var(--category-scroll-offset,15rem)]";
