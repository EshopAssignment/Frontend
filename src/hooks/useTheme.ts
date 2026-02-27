import { STORAGE_THEME } from "@/constants/storageKeys";
import type { ThemeChangeMeta, ThemeId } from "@/types/DrawerTypes";
import { useCallback, useEffect, useState } from "react";

function applyTheme(theme: ThemeId, meta?:ThemeChangeMeta) {
    const root = document.documentElement;

    if(meta?.x != null && meta?.y !=null) {
        root.style.setProperty("--vt-x", `${meta.x}px`);
        root.style.setProperty("--vt-y", `${meta.y}px`);
    }

    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_THEME, theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_THEME) as ThemeId | null;
    return saved ?? "dark";
  });

    useEffect(() => {
        applyTheme(theme);
    }, []);

    const setTheme = useCallback((next: ThemeId, meta?: ThemeChangeMeta) => {
        if(next === theme) return;

        const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> };
    };

        setThemeState(next)

        if(doc.startViewTransition) {
            doc.startViewTransition(() => applyTheme(next, meta));
        } else {
            applyTheme(next, meta);
        }
    }, [theme]);

    return {theme, setTheme}
}