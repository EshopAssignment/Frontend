import { API_ORIGIN } from "@/config";
import { asNum } from "./money";

export type ImageLike = {
  originalUrl: string;
  largeUrl: string;
  cardUrl: string;
  stackUrl: string;
  thumbUrl: string;
  sortOrder?: number | string | null;
  isPrimary: boolean;
  altText?: string | null;
};

export function resolveImageUrl(raw?: string | null) {
  const val = (raw ?? "").trim();
  if (!val) return "";

  if (/^https?:\/\//i.test(val)) return val;
  if (val.startsWith("//")) return window.location.protocol + val;
  if (val.startsWith("/")) return `${API_ORIGIN}${val}`;

  return val;
}

export function normalizeImages<T extends ImageLike>(list: T[]): T[] {
  const xs = (list ?? [])
    .filter((x) => (x?.originalUrl ?? "").trim())
    .map((x) => ({
      ...x,
      originalUrl: String(x.originalUrl ?? "").trim(),
      largeUrl: String(x.largeUrl ?? "").trim(),
      cardUrl: String(x.cardUrl ?? "").trim(),
      stackUrl: String(x.stackUrl ?? "").trim(),
      thumbUrl: String(x.thumbUrl ?? "").trim(),
      sortOrder: asNum(x.sortOrder, 0),
    }))
    .slice()
    .sort((a, b) => asNum(a.sortOrder, 0) - asNum(b.sortOrder, 0));

  for (let i = 0; i < xs.length; i++) {
    xs[i] = { ...xs[i], sortOrder: i };
  }

  if (xs.length > 0) {
    const idx = xs.findIndex((x) => x.isPrimary);
    const primaryIndex = idx >= 0 ? idx : 0;

    xs.forEach((x, i) => {
      x.isPrimary = i === primaryIndex;
    });
  }

  return xs;
}

export function addImage<T extends ImageLike>(
  list: T[],
  image: Pick<T, "originalUrl" | "largeUrl" | "cardUrl" | "stackUrl" | "thumbUrl">,
  opts?: { altText?: string | null; makePrimary?: boolean }
): T[] {
  const cleanOriginal = String(image?.originalUrl ?? "").trim();
  if (!cleanOriginal) return normalizeImages(list ?? []);

  const next = [
    ...(list ?? []),
    {
      ...image,
      originalUrl: cleanOriginal,
      largeUrl: String(image.largeUrl ?? "").trim(),
      cardUrl: String(image.cardUrl ?? "").trim(),
      stackUrl: String(image.stackUrl ?? "").trim(),
      thumbUrl: String(image.thumbUrl ?? "").trim(),
      sortOrder: list?.length ?? 0,
      isPrimary: opts?.makePrimary ?? (list?.length ?? 0) === 0,
      altText: opts?.altText ?? null,
    } as T,
  ];

  return normalizeImages(next);
}

export function removeImageAt<T extends ImageLike>(list: T[], idx: number): T[] {
  const xs = (list ?? []).slice();
  if (idx < 0 || idx >= xs.length) return normalizeImages(xs);
  xs.splice(idx, 1);
  return normalizeImages(xs);
}

export function setPrimaryImage<T extends ImageLike>(list: T[], idx: number): T[] {
  const xs = (list ?? []).map((x, i) => ({ ...x, isPrimary: i === idx }));
  return normalizeImages(xs);
}

export function setAltText<T extends ImageLike>(list: T[], idx: number, altText: string): T[] {
  const xs = (list ?? []).map((x, i) => (i === idx ? { ...x, altText } : x));
  return normalizeImages(xs);
}

export function getPrimaryUrl<T extends ImageLike>(list: T[]): string {
  const xs = normalizeImages(list ?? []);
  return xs.find((x) => x.isPrimary)?.largeUrl ?? xs[0]?.largeUrl ?? "";
}

export function getCardUrl<T extends ImageLike>(img?: T | null): string {
  return img?.cardUrl ?? "";
}

export function getThumbUrl<T extends ImageLike>(img?: T | null): string {
  return img?.thumbUrl ?? "";
}

export function getStackUrl<T extends ImageLike>(img?: T | null): string {
  return img?.stackUrl ?? "";
}