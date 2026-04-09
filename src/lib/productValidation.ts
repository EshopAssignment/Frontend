import { asNum, clampVatRatePercent, priceIncVat } from "@/helpers/money";

export function money0(n: number) {
  return Math.round(n);
}

export function computeIncVat(priceExVat: unknown, vatRatePercent: unknown) {
  return priceIncVat(priceExVat, vatRatePercent);
}

type ProductImageLike = {
  originalUrl?: unknown;
  largeUrl?: unknown;
  cardUrl?: unknown;
  stackUrl?: unknown;
  thumbUrl?: unknown;
  sortOrder?: unknown;
  isPrimary?: unknown;
  altText?: unknown;
};

export type ProductFormLike = {
  name?: unknown;
  description?: unknown;
  palletType?: unknown;
  condition?: unknown;
  priceExVat?: unknown;
  vatRatePercent?: unknown;
  onHand?: unknown;
  images?: unknown;
  isActive?: unknown;
};

export type ProductFormErrors = Partial<
  Record<
    "name" | "description" | "palletType" | "condition" | "priceExVat" | "vatRatePercent" | "onHand" | "images",
    string
  >
>;

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function normalizeImageList(input: unknown): ProductImageLike[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter(Boolean)
    .map((img) => (img ?? {}) as ProductImageLike)
    .filter(
      (img) =>
        hasText(img.originalUrl) &&
        hasText(img.largeUrl) &&
        hasText(img.cardUrl) &&
        hasText(img.stackUrl) &&
        hasText(img.thumbUrl)
    );
}

export function validateProductForm(input: ProductFormLike): ProductFormErrors {
  const errors: ProductFormErrors = {};

  const name = String(input.name ?? "").trim();
  const description = String(input.description ?? "").trim();
  const palletType = String(input.palletType ?? "").trim();
  const condition = String(input.condition ?? "").trim();

  const priceExVat = asNum(input.priceExVat, NaN);
  const onHand = asNum(input.onHand, NaN);
  const vat = clampVatRatePercent(input.vatRatePercent, 25);

  const images = normalizeImageList(input.images);
  const primaryCount = images.filter((img) => Boolean(img.isPrimary)).length;

  if (!name) errors.name = "Namn krävs.";
  else if (name.length > 200) errors.name = "Namn är för långt (max 200).";

  if (!description) errors.description = "Beskrivning krävs.";
  else if (description.length > 1000) errors.description = "Beskrivningen är för lång (max 1000).";

  if (!palletType) errors.palletType = "Välj palltyp.";
  if (!condition) errors.condition = "Välj skick.";

  if (!Number.isFinite(priceExVat) || priceExVat < 0) {
    errors.priceExVat = "Pris måste vara 0 eller mer.";
  }

  if (!Number.isFinite(onHand) || onHand < 0) {
    errors.onHand = "Lager måste vara 0 eller mer.";
  }

  if (vat !== 6 && vat !== 12 && vat !== 25) {
    errors.vatRatePercent = "Moms måste vara 6, 12 eller 25.";
  }

  if (images.length === 0) {
    errors.images = "Minst en bild krävs.";
  } else if (primaryCount !== 1) {
    errors.images = "Exakt en bild måste vara primär.";
  }

  return errors;
}

export function hasMissingRequiredForActive(input: ProductFormLike) {
  return Object.keys(validateProductForm(input)).length > 0;
}