import { useEffect, useMemo, useRef, useState } from "react";
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
import { uploadImageAndGetPublicUrl } from "@/Services/uploadService";

import {
  addImage,
  normalizeImages,
  removeImageAt,
  setAltText,
  setPrimaryImage,
  getPrimaryUrl,
  resolveImageUrl,
} from "@/helpers/ImageHelper";

type Props = {
  title: string;
  productId?: number;
  onSubmit: (body: AdminCreateReq | AdminUpdateReq) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
};

type TouchedMap = Partial<Record<keyof AdminCreateReq, boolean>>;

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
    images: [],
    priceExVat: 0,
    vatRatePercent: 25,
    onHand: 0,
    isActive: false,
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [touched, setTouched] = useState<TouchedMap>({});

  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const uploadAbortRef = useRef<AbortController | null>(null);

  const [selectedUrl, setSelectedUrl] = useState<string>("");

  useEffect(() => {
    if (!isEdit || !data) return;

    const incomingImages =
      normalizeImages(
        (data.images ?? []).map((x: any) => ({
          url: x.url,
          sortOrder: x.sortOrder,
          isPrimary: x.isPrimary,
          altText: x.altText ?? null,
        }))
      ) as any;

    setForm({
      name: data.name,
      description: data.description,
      palletType: data.palletType,
      condition: data.condition,
      images: incomingImages,
      priceExVat: asNum(data.priceExVat, 0),
      vatRatePercent: clampVatRatePercent(data.vatRatePercent),
      onHand: asNum(data.onHand, 0),
      isActive: Boolean(data.isActive),
    });

    setSelectedUrl(getPrimaryUrl(incomingImages) || incomingImages?.[0]?.url || "");
    setErrors({});
    setTouched({});
    setLocalFile(null);
    setIsUploadingImage(false);
    uploadAbortRef.current?.abort();
    uploadAbortRef.current = null;
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

  const previewUrl = useMemo(() => (localFile ? URL.createObjectURL(localFile) : undefined), [localFile]);
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
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function validateNow(nextForm = form) {
    const nextErrors = validateProductForm(nextForm);
    setErrors(nextErrors);
    return nextErrors;
  }

  async function onPickImage(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Endast bildfiler är tillåtna.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bilden är för stor (max 5 MB).");
      return;
    }

    uploadAbortRef.current?.abort();
    uploadAbortRef.current = new AbortController();

    setLocalFile(file);
    setIsUploadingImage(true);

    try {
      const publicUrl = await uploadImageAndGetPublicUrl(file, { signal: uploadAbortRef.current.signal });

      setForm((p) => {
        const nextImages = addImage(p.images ?? [], publicUrl) as any;
        setSelectedUrl(publicUrl);
        return { ...p, images: nextImages };
      });

      setTouched((t) => ({ ...t, images: true as any }));
      toast.success("Bild uppladdad.");
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      toast.error(String(err?.message ?? "Kunde inte ladda upp bilden."));
    } finally {
      setIsUploadingImage(false);
      setLocalFile(null);
    }
  }

  function onRemoveImage(idx: number) {
    setForm((p) => {
      const nextImages = removeImageAt(p.images ?? [], idx) as any;
      const nextSelected = selectedUrl && nextImages.some((x: any) => x.url === selectedUrl)
        ? selectedUrl
        : getPrimaryUrl(nextImages) || nextImages?.[0]?.url || "";
      setSelectedUrl(nextSelected);
      return { ...p, images: nextImages };
    });
    setTouched((t) => ({ ...t, images: true as any }));
  }

  function onMakePrimary(idx: number) {
    setForm((p) => {
      const nextImages = setPrimaryImage(p.images ?? [], idx) as any;
      setSelectedUrl(getPrimaryUrl(nextImages) || selectedUrl);
      return { ...p, images: nextImages };
    });
    setTouched((t) => ({ ...t, images: true as any }));
  }

  function onAltChange(idx: number, alt: string) {
    setForm((p) => ({ ...p, images: setAltText(p.images ?? [], idx, alt) as any }));
    setTouched((t) => ({ ...t, images: true as any }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (isUploadingImage) {
      toast.error("Vänta tills bilden är uppladdad.");
      return;
    }

    const payload: AdminCreateReq = {
      ...form,
      name: String(form.name ?? "").trim(),
      description: String(form.description ?? "").trim(),
      priceExVat: round2(asNum(form.priceExVat, 0)),
      vatRatePercent: clampVatRatePercent(form.vatRatePercent),
      onHand: Math.max(0, Math.floor(asNum(form.onHand, 0))),
      isActive: isEdit ? Boolean(form.isActive) : false,
      images: normalizeImages(form.images ?? []) as any,
    };

    const nextErrors = validateNow(payload);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Ett eller fler fält är ej giltiga");
      setTouched({
        name: true,
        description: true,
        palletType: true,
        condition: true,
        priceExVat: true,
        vatRatePercent: true,
        onHand: true,
        images: true as any,
      });
      return;
    }

    if (hasMissingRequiredForActive(payload)) {
      payload.isActive = false;
    }

    try {
      if (isEdit) {
        const body: AdminUpdateReq = { id: productId!, ...payload } as AdminUpdateReq;
        await onSubmit(body);
        toast.success("Produkt uppdaterad.");
      } else {
        await onSubmit(payload);
        toast.success("Produkt skapad som inaktiv.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Kunde inte spara produkten.";
      toast.error(String(msg));
    }
  }

  const heroUrl = resolveImageUrl(selectedUrl || getPrimaryUrl(form.images as any) || "") || previewUrl || "";

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

          <div className="row">
            <label>
              Produktbilder
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onPickImage(e.target.files?.[0])}
                disabled={loading || isUploadingImage}
              />
              {isUploadingImage && <p className="muted">Laddar upp bild…</p>}
              {(touched as any).images && (errors as any).images && <p className="field-error">{(errors as any).images}</p>}
            </label>

            <div>
              {heroUrl ? <img src={heroUrl} alt="Preview" /> : <p className="muted">Ingen bild vald</p>}
            </div>
          </div>

          {!!(form.images?.length ?? 0) && (
            <div className="image-grid">
              {(form.images as any).map((img: any, idx: number) => {
                const src = resolveImageUrl(img.url);
                const isPrimary = Boolean(img.isPrimary);

                return (
                  <div key={`${img.url}-${idx}`} className={`image-tile ${isPrimary ? "is-primary" : ""}`}>
                    <button type="button" className="thumb" onClick={() => setSelectedUrl(img.url)}>
                      <img src={src} alt={img.altText ?? form.name ?? "Product image"} />
                    </button>

                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => onMakePrimary(idx)}
                        disabled={loading || isUploadingImage}
                      >
                        {isPrimary ? "Primär" : "Gör primär"}
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={() => onRemoveImage(idx)}
                        disabled={loading || isUploadingImage}
                      >
                        Ta bort
                      </button>
                    </div>

                    <input
                      className="input"
                      placeholder="Alt-text (valfritt)"
                      value={img.altText ?? ""}
                      onChange={(e) => onAltChange(idx, e.target.value)}
                      disabled={loading || isUploadingImage}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="row actions">
            <button type="button" className="btn" onClick={onCancel} disabled={loading || isUploadingImage}>
              Avbryt
            </button>
            <button type="submit" className="btn" disabled={loading || isUploadingImage}>
              {loading ? "Sparar…" : isUploadingImage ? "Laddar bild…" : "Spara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}