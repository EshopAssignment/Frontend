//gpt 5.2 generated helpers.

export function fmtUtc(input: string | Date | null | undefined) {
    if (!input) return "-";
    const s = typeof input === "string"? input : input.toISOString();
    const safe = s.endsWith("Z") ? s : s + "Z";
    const d = new Date(safe);

    return isNaN(d.getTime())
        ? "-"
        : d.toLocaleString("sv-SE", {dateStyle: "short", timeStyle: "short"});
}

export function fmtSEK(n: number | null | undefined) {
    const x = typeof n === "number" && Number.isFinite(n) ? n : 0;
    return new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(x);
}

export function toStatusLable(raw: unknown) {
    if ( raw == null) return "-";
    if ( typeof raw === "string") return raw;

    if(typeof raw === "number") {
        return String(raw)
    }

    return String(raw);
}