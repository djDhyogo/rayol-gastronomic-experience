import { useCallback, useState } from "react";
import type { MenuViewMode } from "@/components/menu/list-view/view-mode-toggle";

const STORAGE_KEY = "rayol-menu-view-mode";

/** Persiste entre remounts (ex.: troca de categoria) sem alterar a URL. */
let memoryViewMode: MenuViewMode = "cards";

function readStoredViewMode(): MenuViewMode {
  if (typeof window === "undefined") return memoryViewMode;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "cards" || stored === "list") {
      memoryViewMode = stored;
      return stored;
    }
  } catch {
    // sessionStorage indisponível
  }
  return memoryViewMode;
}

export function useMenuViewMode() {
  const [viewMode, setViewModeState] = useState<MenuViewMode>(readStoredViewMode);

  const setViewMode = useCallback((next: MenuViewMode) => {
    memoryViewMode = next;
    setViewModeState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sessionStorage indisponível
    }
  }, []);

  return [viewMode, setViewMode] as const;
}
