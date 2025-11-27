import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetProduct, type AdminCreateReq } from "../../Services/adminProductService";

type Props = {
  title: string;
  productId?: number;
  onSubmit: (body: AdminCreateReq, file?: File) => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ProductForm({ title, productId, onSubmit, onCancel, loading }: Props) {
  const isEdit = typeof productId === "number";
  const { data } = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: () => adminGetProduct(productId!),
    enabled: isEdit,
  });

  const [form, setForm] = useState<AdminCreateReq>({
    name: "",
    description: "",
    palletType: "",
    condition: "",
    imgUrl: "",
    price: 0,
    stockQuantity: 0,
    isActive: true,
  });

  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (data && isEdit) {
      setForm({
        name: data.name,
        description: data.description,
        palletType: data.palletType,
        condition: data.condition,
        imgUrl: data.imgUrl ?? "",
        price: data.price,
        stockQuantity: data.stockQuantity,
        isActive: data.isActive,
      });
    }
  }, [data, isEdit]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...form, imgUrl: form.imgUrl ?? "" }, file);
  }
//clanker(ChatGpt5.1) made form to outline the fields for testing. 
  return (
    <div className="modal">

      <div className="modal-panel">
        <h3>{title}</h3>
        <form onSubmit={submit} className="form-grid">
          <label>Namn<input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Beskrivning<textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
          <label>Palltyp<input className="input" value={form.palletType} onChange={e => setForm({ ...form, palletType: e.target.value })} /></label>
          <label>Skick<input className="input" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} /></label>
          <label>Bild-URL<input className="input" value={form.imgUrl} onChange={e => setForm({ ...form, imgUrl: e.target.value })} /></label>
          <label>Pris<input className="input" type="text" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></label>
          <label>Lager<input className="input" type="text" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: Number(e.target.value) })} /></label>

          <label className="check">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
            <span>Aktiv</span>
          </label>

          {isEdit && (
            <div className="row">
              <label>Byt bild (fil)
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
              </label>
              {(previewUrl || form.imgUrl) && (
                <div style={{ marginTop: ".5rem" }}>
                  <img
                    src={previewUrl || form.imgUrl}
                    alt="Preview"
                    style={{ maxWidth: "200px", border: "1px solid var(--border)", borderRadius: 8 }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="row actions">
            <button type="button" className="btn" onClick={onCancel} disabled={loading}>Avbryt</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? "Sparar…" : "Spara"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
