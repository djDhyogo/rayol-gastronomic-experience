import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";

const HEADER_OFFSET_PX = 68; // 4.25rem
/** Espaço sob o header: categorias + toggle Cards/Lista */
const RAIL_OFFSET_PX = 168;
const CLICK_LOCK_MS = 1000;

export interface CategoryScrollSpyApi {
  activeSlug: string | null;
  setSectionRef: (slug: string, element: HTMLElement | null) => void;
  setRailItemRef: (slug: string, element: HTMLElement | null) => void;
  scrollToCategory: (slug: string | null) => void;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  const scrollToCategory = useCallback(
    (slug: string | null) => {
      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
      const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

      if (slug === null) {
        setActiveSlug(null);
        centerRailItem("all");
        window.scrollTo({ top: 0, behavior });
        return;
      }

      setActiveSlug(slug);
      centerRailItem(slug);

      const section = sectionEls.current.get(slug);
      if (!section) return;

      const top =
        section.getBoundingClientRect().top +
        window.scrollY -
        HEADER_OFFSET_PX -
        RAIL_OFFSET_PX;

      window.scrollTo({ top: Math.max(0, top), behavior });
    },
    [centerRailItem],
  );

  useEffect(() => {
    if (sectionSlugs.length === 0) {
      observerRef.current?.disconnect();
      observerRef.current = null;
      return;
    }

    const topOffset = HEADER_OFFSET_PX + RAIL_OFFSET_PX;
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
    // slugsKey evita recriar o observer a cada render com array novo de mesma lista
  }, [slugsKey, sectionSlugs, pickActiveFromRatios]);

  // Centraliza chip ativo só no trilho (horizontal), sem afetar o scroll da página
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
  };
}

/** Offset CSS para âncora sob header + rail sticky (categorias + toggle). */
export const CATEGORY_SECTION_SCROLL_MARGIN = "scroll-mt-[calc(4.25rem+10.5rem)]";
