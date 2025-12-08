import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetProduct, adminGetProductOptions, type AdminCreateReq,type AdminProductOptions,type AdminUpdateReq,} from "../../Services/adminProductService";

type Props = {
  title: string;
  productId?: number; 
  onSubmit: (body: AdminCreateReq | AdminUpdateReq, file?: File) => void;
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
    onHand: 0,
    isActive: true,
  });

  const [file, setFile] = useState<File | undefined>(undefined);

useEffect(() => {
  if (!isEdit || !data) return;
  setForm({
    name: data.name,
    description: data.description,
    palletType: data.palletType,
    condition: data.condition,
    imgUrl: data.imgUrl ?? "",
    priceExVat: data.priceExVat,
    onHand: data.onHand,
    isActive: data.isActive,
  });
}, [isEdit, data]);
useEffect(() => {
  if (!options) return;
  setForm(prev => ({
    ...prev,
    palletType: prev.palletType || options.productTypes[0]?.value || "",
    condition: prev.condition || options.productConditions[0]?.value || "",
  }));
}, [options]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (isEdit) {
      const body: AdminUpdateReq = { id: productId!, ...form };
      onSubmit(body, file);
    } else {
      onSubmit(form, file);
    }
  }

  return (
    <div className="modal">
      <div className="modal-panel">
        <h3>{title}</h3>

        <form onSubmit={submit} className="form-grid">
          <label>
            Namn
            <input
            formNoValidate
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label>
            Beskrivning
            <textarea
              className="input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <label>
            Palltyp
            <select
              className="input"
              value={form.palletType}
              onChange={(e) => setForm({ ...form, palletType: e.target.value })}
              disabled={!options}
              required
            >
              {options?.productTypes.map(o => (
                <option className="options" key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label>
            Skick
            <select
              className="input"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              disabled={!options}
              required
            >
              {options?.productConditions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label>
            Pris exkl. moms
            <input
            formNoValidate
              className="input"
              type="number"
              step="0.01"
              min={0}
              value={form.priceExVat}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, priceExVat: v === "" ? 0 : Number(v) });
              }}
            />
          </label>

          <label>
            Lager (On hand)
            <input
            formNoValidate
              className="input"
              type="number"
              min={0}
              value={form.onHand}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, onHand: v === "" ? 0 : Number(v) });
              }}
            />
          </label>

          <label className="check">
            <input
            formNoValidate
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <span>Aktiv</span>
          </label>

          {isEdit && (
            <div className="row">
              <label>
                Byt bild (fil)
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
              </label>
              {(previewUrl || form.imgUrl) && (
                <div style={{ marginTop: ".5rem" }}>
                  <img
                    src={previewUrl || form.imgUrl}
                    alt="Preview"
                  />
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
