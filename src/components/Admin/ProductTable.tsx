import type { AdminProduct } from "../../Services/adminProductService";
//cleaned using gpt5.2
type Props = {
  data: AdminProduct[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (id: number) => void;
  onToggle: (id: number, current: boolean) => void;
};

function fmtSEK0(n: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function vatSafe(v: unknown): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (n === 6 || n === 12 || n === 25) return n;
  return 25;
}

function priceIncVat(priceExVat: number, vatRatePercent: number): number {
  const ex = Number.isFinite(priceExVat) ? priceExVat : 0;
  const vat = vatSafe(vatRatePercent);
  return Math.round(ex * (1 + vat / 100)); 
}

export default function ProductTable({
  data,
  page,
  totalPages,
  onPrev,
  onNext,
  onEdit,
  onToggle,
}: Props) {
  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Namn</th>
            <th>Aktiv</th>
            <th>Pris (inkl moms)</th>
            <th>Moms</th>
            <th>Lager</th>
            <th>Meny</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => {
            const idNum = p.id;
            const inc = priceIncVat(p.priceExVat, p.vatRatePercent);

            return (
              <tr key={String(p.id)}>
                <td>{p.id}</td>
                <td>{p.name}</td>

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={p.isActive}
                      onChange={() => onToggle(idNum, p.isActive)}
                    />
                    <span className="slider" />
                  </label>
                </td>

                <td>{fmtSEK0(inc)}</td>
                <td>{vatSafe(p.vatRatePercent)}%</td>
                <td>{p.available}</td>

                <td>
                  <button className="btn" onClick={() => onEdit(idNum)}>
                    Redigera
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={onPrev} disabled={page === 1}>
          {"<"}
        </button>
        <span>
          Sida {page} av {totalPages}
        </span>
        <button onClick={onNext} disabled={page === totalPages}>
          {">"}
        </button>
      </div>
    </>
  );
}
