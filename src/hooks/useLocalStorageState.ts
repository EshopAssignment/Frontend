import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initial: T, parse?: (raw: string) => T) {
    const [value, setValue] = useState<T>(() => {
        const raw = localStorage.getItem(key);
        if (raw == null) return initial;
        try{
            return parse ? parse(raw): (JSON.parse(raw) as T);
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        try {
            const raw = typeof value === "string" ? value : JSON.stringify(value);
            localStorage.setItem(key, raw);
        } catch {

        }
    }, [key, value]);

    return [value, setValue] as const;
}