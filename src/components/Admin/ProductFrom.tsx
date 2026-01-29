import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adminGetProduct,
  adminGetProductOptions,
  type AdminCreateReq,
  type AdminProductOptions,
  type AdminUpdateReq,
} from "../../Services/adminProductService";

import {
  computeIncVat,
  money0,
  validateProductForm,
  hasMissingRequiredForActive,
  type ProductFormErrors,
} from "@/lib/productValidation";
import { asNum, clampVatRatePercent, round2 } from "@/helpers/money";

type Props = {
  title: string;
  productId?: number;
  onSubmit: (body: AdminCreateReq | AdminUpdateReq, file?: File) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ProductForm({ title, productId, onSubmit, onCancel, loading }: Props) {
  const idNum = typeof productId === "number" ? productId : Number(productId);
  const isEdit = Number.isFinite(idNum);

  const { data } = useQuery({
    queryKey: ["admin-product", idNum],
    queryFn: () => adminGetProduct(idNum!),
    enabled: isEdit,
    staleTime: 10_000,
  });

  const { data: options } = useQuery<AdminProductOptions>({
    queryKey: ["admin-product-options"],
    queryFn: () => adminGetProductOptions(),
    staleTime: 60 * 60 * 1000,
  });

  const [form, setForm] = useState<AdminCreateReq>({
    name: "",
    description: "",
    palletType: "",
    condition: "",
    imgUrl: "",
    priceExVat: 0,
    vatRatePercent: 25,
    onHand: 0,
    isActive: false, 
  });

  const [file, setFile] = useState<File | undefined>(undefined);

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isEdit || !data) return;

    setForm({
      name: data.name,
      description: data.description,
      palletType: data.palletType,
      condition: data.condition,
      imgUrl: data.imgUrl ?? "",
      priceExVat: asNum(data.priceExVat, 0),
      vatRatePercent: clampVatRatePercent(data.vatRatePercent),
      onHand: asNum(data.onHand, 0),
      isActive: Boolean(data.isActive),
    });

    setErrors({});
    setTouched({});
  }, [isEdit, data]);

  useEffect(() => {
    if (!options) return;

    setForm((prev) => ({
      ...prev,
      palletType: prev.palletType || options.productTypes[0]?.value || "",
      condition: prev.condition || options.productConditions[0]?.value || "",
      vatRatePercent: clampVatRatePercent(prev.vatRatePercent),
    }));
  }, [options]);

  useEffect(() => {
    const missing = hasMissingRequiredForActive(form);
    if (missing && form.isActive) {
      setForm((p) => ({ ...p, isActive: false }));
    }
  }, [form]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const priceIncVat = useMemo(() => {
    const inc = computeIncVat(form.priceExVat, form.vatRatePercent);
    return money0(inc);
  }, [form.priceExVat, form.vatRatePercent]);

  const vatOptions = useMemo(() => {
    const list = (options as any)?.vatRates ?? [];
    return Array.isArray(list) && list.length
      ? list
      : [
          { value: 6, label: "6%", intValue: 6 },
          { value: 12, label: "12%", intValue: 12 },
          { value: 25, label: "25%", intValue: 25 },
        ];
  }, [options]);

  function setField<K extends keyof AdminCreateReq>(key: K, value: AdminCreateReq[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setTouched((t) => ({ ...t, [String(key)]: true }));
  }

  function validateNow(nextForm = form) {
    const nextErrors = validateProductForm(nextForm);
    setErrors(nextErrors);
    return nextErrors;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const payload: AdminCreateReq = {
      ...form,
      name: String(form.name ?? "").trim(),
      description: String(form.description ?? "").trim(),
      priceExVat: round2(asNum(form.priceExVat, 0)),
      vatRatePercent: clampVatRatePercent(form.vatRatePercent),
      onHand: Math.max(0, Math.floor(asNum(form.onHand, 0))),
      isActive: isEdit ? Boolean(form.isActive) : false,
    };

    const nextErrors = validateNow(payload);
    const hasErrors = Object.keys(nextErrors).length > 0;

    if (hasErrors) {
      toast.error("ett eller fler fält är ej giltiga");
      setTouched({
        name: true,
        description: true,
        palletType: true,
        condition: true,
        priceExVat: true,
        vatRatePercent: true,
        onHand: true,
      });
      return;
    }

    if (hasMissingRequiredForActive(payload)) {
      payload.isActive = false;
    }

    try {
      if (isEdit) {
        const body: AdminUpdateReq = { id: productId!, ...payload } as AdminUpdateReq;
        await onSubmit(body, file);
        toast.success("Produkt uppdaterad.");
      } else {
        await onSubmit(payload, file);
        toast.success("Produkt skapad som inaktiv.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Kunde inte spara produkten.";
      toast.error(String(msg));
    }
  }


  return (
    <div className="modal">
      <div className="modal-panel">
        <h3>{title}</h3>

        <form onSubmit={submit} className="form-grid" noValidate>
          <label>
            Namn
            <input
              className="input"
              value={form.name}
              onChange={(e) => setField("name", e.target.value as any)}
              onBlur={() => validateNow()}
              required
            />
            {touched.name && errors.name && <p className="field-error">{errors.name}</p>}
          </label>

          <label>
            Beskrivning
            <textarea
              className="input"
              value={form.description}
              onChange={(e) => setField("description", e.target.value as any)}
              onBlur={() => validateNow()}
            />
            {touched.description && errors.description && <p className="field-error">{errors.description}</p>}
          </label>

          <label>
            Palltyp
            <select
              className="input"
              value={form.palletType}
              onChange={(e) => setField("palletType", e.target.value as any)}
              onBlur={() => validateNow()}
              disabled={!options}
              required
            >
              {options?.productTypes.map((o) => (
                <option className="options" key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {touched.palletType && errors.palletType && <p className="field-error">{errors.palletType}</p>}
          </label>

          <label>
            Skick
            <select
              className="input"
              value={form.condition}
              onChange={(e) => setField("condition", e.target.value as any)}
              onBlur={() => validateNow()}
              disabled={!options}
              required
            >
              {options?.productConditions.map((o) => (
                <option className="options" key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {touched.condition && errors.condition && <p className="field-error">{errors.condition}</p>}
          </label>

          <label>
            Pris exkl. moms
            <input
              className="input"
              type="number"
              step="0.01"
              min={0}
              value={form.priceExVat}
              onChange={(e) => setField("priceExVat", e.target.value === "" ? 0 : (Number(e.target.value) as any))}
              onBlur={() => validateNow()}
            />
            {touched.priceExVat && errors.priceExVat && <p className="field-error">{errors.priceExVat}</p>}
          </label>

          <label>
            Moms
            <div className="vat-group">
              <select
                className="input"
                value={String(clampVatRatePercent(form.vatRatePercent))}
                onChange={(e) => setField("vatRatePercent", Number(e.target.value) as any)}
                onBlur={() => validateNow()}
                disabled={!options}
                required
              >
                {vatOptions
                  .slice()
                  .sort((a: any, b: any) => (a.intValue ?? a.value) - (b.intValue ?? b.value))
                  .map((o: any) => {
                    const v = Number(o.intValue ?? o.value);
                    return (
                      <option className="options" key={v} value={v}>
                        {o.label ?? `${v}%`}
                      </option>
                    );
                  })}
              </select>

              <span className="muted" title="Beräknat från exkl. moms + momssats">
                Inkl: {priceIncVat} kr
              </span>
            </div>
            {touched.vatRatePercent && errors.vatRatePercent && <p className="field-error">{errors.vatRatePercent}</p>}
          </label>

          <label>
            Lager (On hand)
            <input
              className="input"
              type="number"
              min={0}
              value={form.onHand}
              onChange={(e) => setField("onHand", e.target.value === "" ? 0 : (Number(e.target.value) as any))}
              onBlur={() => validateNow()}
            />
            {touched.onHand && errors.onHand && <p className="field-error">{errors.onHand}</p>}
          </label>

          {isEdit && (
            <div className="row">
              <label>
                Byt bild (fil)
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
              </label>

              {(previewUrl || form.imgUrl) && (
                <div>
                  <img src={previewUrl || form.imgUrl} alt="Preview" />
                </div>
              )}
            </div>
          )}

          <div className="row actions">
            <button type="button" className="btn" onClick={onCancel} disabled={loading}>
              Avbryt
            </button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sparar…" : "Spara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
