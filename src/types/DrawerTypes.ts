type ThemeId = "light" | "dark" | "snow" | "beige" | "forest" | "midnight";
export type {ThemeId}

export type ThemeChangeMeta = {
    x?: number;
    y?: number;
}


export type CookiePrefs = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
}
