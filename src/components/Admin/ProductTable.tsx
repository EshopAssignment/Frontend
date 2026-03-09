import type { AdminProduct } from "@/Services/adminProductService";
import { priceIncVat } from "@/helpers/money";
import { fmtSEK } from "@/helpers/orderFormat";

type Props = {
  data: AdminProduct[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onEdit: (id: number) => void;
  onToggle: (id: number, current: boolean) => void;
};

export default function ProductTable({
  data,
  page,
  totalPages,
  onPrev,
  onNext,
  onEdit,
  onToggle,
}: Props) {
  const safeTotalPages = Math.max(1, totalPages);

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
          {data.map((product) => {
            const priceIncludingVat = priceIncVat(product.priceExVat, product.vatRatePercent);

            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>

                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() => onToggle(product.id, product.isActive)}
                    />
                    <span className="slider" />
                  </label>
                </td>

                <td>{fmtSEK(priceIncludingVat)}</td>
                <td>{product.vatRatePercent}%</td>
                <td>{product.available}</td>

                <td>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onEdit(product.id)}
                  >
                    Redigera
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button type="button" onClick={onPrev} disabled={page <= 1}>
          {"<"}
        </button>

        <span>
          Sida {page} av {safeTotalPages}
        </span>

        <button type="button" onClick={onNext} disabled={page >= safeTotalPages}>
          {">"}
        </button>
      </div>
    </>
  );
}