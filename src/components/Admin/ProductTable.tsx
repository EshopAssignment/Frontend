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
          {data.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>
                <label className="switch">
                  <input type="checkbox" checked={p.isActive} onChange={() => onToggle(p.id, p.isActive)} />
                  <span className="slider" />
                </label>
              </td>
              <td>{p.price}</td>
              <td>{p.stockQuantity}</td>
              <td>
                <button className="btn" onClick={() => onEdit(p.id)}>Redigera</button>
              </td>
            </tr>
          ))}
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
