import { STORAGE_THEME } from "@/constants/storageKeys";
import type { ThemeId } from "@/types/DrawerTypes";
import { useEffect, useState } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<ThemeId>(() => {
        const saved = localStorage.getItem(STORAGE_THEME) as ThemeId | null;
        return saved ?? "dark"
    });

    useEffect (() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(STORAGE_THEME, theme);
    }, [theme]);

    return {theme, setTheme}
}