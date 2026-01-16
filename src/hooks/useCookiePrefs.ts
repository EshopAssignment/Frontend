import { STORAGE_COOKIES } from "@/constants/storageKeys";
import type { CookiePrefs } from "@/types/DrawerTypes";
import { useEffect, useState } from "react";

const DEFAULT: CookiePrefs = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
};

export function useCookiePrefs() {
    const [cookies, setCookies] = useState<CookiePrefs>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_COOKIES);
            return raw ? {...DEFAULT, ...JSON.parse(raw)} : DEFAULT;
        } catch {
            return DEFAULT;
        }
    });
    
    useEffect(() => {
        localStorage.setItem(STORAGE_COOKIES, JSON.stringify(cookies));
    }, [cookies]);

    const setCookie = (key: keyof CookiePrefs, value: boolean) => {
    if (key === "necessary") return;
    setCookies((p) => ({ ...p,
         [key]: value,
          necessary: true 
        }));
    };

    const reset = () => setCookies(DEFAULT);
    return { cookies, setCookie, reset };
}