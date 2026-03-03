import { asNum, clampVatRatePercent, priceIncVat } from "@/helpers/money";

export function money0(n: number) {
    return Math.round(n);       
}

export function computeIncVat(priceExVat: unknown, vatRatePercent: unknown) {
    return priceIncVat(priceExVat, vatRatePercent);
}

export type ProductFormLike = {
    name?: unknown;
    description: unknown;
    palletType?: unknown;
    condition?: unknown;
    priceExVat?: unknown;
    vatRatePercent?: unknown;
    onHand?: unknown;
    imgUrl?: unknown;
    isActive?: unknown;
}

export type ProductFormErrors = Partial<Record<
      "name" | "description" | "palletType" | "condition" | "priceExVat" | "vatRatePercent" | "onHand" | "imgUrl",
  string>>;


export function validateProductForm(input: ProductFormLike): ProductFormErrors {
  const errors: ProductFormErrors = {};

  const name = String(input.name ?? "").trim();
  const description = String(input.description ?? "").trim();
  const palletType = String(input.palletType ?? "").trim();
  const condition = String(input.condition ?? "").trim();

  const priceExVat = asNum(input.priceExVat, NaN);
  const onHand = asNum(input.onHand, NaN);
  const vat = clampVatRatePercent(input.vatRatePercent, 25);

  if (!name) errors.name = "Namn krävs.";
  if (name.length > 200) errors.name = "Namn är för långt (max 200).";

  if (!description) errors.description = "Beskrivning krävs.";
  if (!palletType) errors.palletType = "Välj palltyp.";
  if (!condition) errors.condition = "Välj skick.";

  if (!Number.isFinite(priceExVat) || priceExVat < 0) errors.priceExVat = "Pris måste vara 0 eller mer.";
  if (!Number.isFinite(onHand) || onHand < 0) errors.onHand = "Lager måste vara 0 eller mer.";

  if (vat !== 6 && vat !== 12 && vat !== 25) errors.vatRatePercent = "Moms måste vara 6, 12 eller 25.";

  return errors;
}

export function hasMissingRequiredForActive(input: ProductFormLike) {
  const name = String(input.name ?? "").trim();
  const description = String(input.description ?? "").trim();
  const palletType = String(input.palletType ?? "").trim();
  const condition = String(input.condition ?? "").trim();

  const priceExVat = asNum(input.priceExVat, NaN);
  const onHand = asNum(input.onHand, NaN);
  const vat = clampVatRatePercent(input.vatRatePercent, 25);

  return (
    !name ||
    !description ||
    !palletType ||
    !condition ||
    !Number.isFinite(priceExVat) ||
    priceExVat < 0 ||
    !Number.isFinite(onHand) ||
    onHand < 0 ||
    (vat !== 6 && vat !== 12 && vat !== 25)
  );
}