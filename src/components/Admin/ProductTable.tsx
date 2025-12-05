import type { ProductDto } from "../../Services/productService";

type Props = {
  data: ProductDto[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (id: number) => void;
  onToggle: (id: number, current: boolean) => void;
  onUpload: (id: number, file: File) => void;
};
//clanker(ChatGpt5.1) made table to outline the fields for testing. 

function toNumId(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

function toMoney(v: unknown): string {
  const n = typeof v === "number" ? v : Number(v);
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK" }).format(safe);
}

export default function ProductTable({ data, page, totalPages, onPrev, onNext, onEdit, onToggle }: Props) {
  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Namn</th>
            <th>Aktiv</th>
            <th>Pris</th>
            <th>Lager</th>
            <th>Meny</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => {
            const idNum = toNumId((p as any).id);
            const price = toMoney((p as any).priceExVat);

            return (
              <tr key={String((p as any).id)}>
                <td>{String((p as any).id)}</td>
                <td>{p.name}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={p.isActive}
                      onChange={() => idNum !== null && onToggle(idNum, p.isActive)}
                      disabled={idNum === null}
                    />
                    <span className="slider" />
                  </label>
                </td>
                <td>{price}</td>
                <td>{p.available}</td>
                <td>
                  <button className="btn" onClick={() => idNum !== null && onEdit(idNum)} disabled={idNum === null}>
                    Redigera
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={onPrev} disabled={page === 1}>{"<"}</button>
        <span>Sida {page} av {totalPages}</span>
        <button onClick={onNext} disabled={page === totalPages}>{">"}</button>
      </div>
    </>
  );
}
