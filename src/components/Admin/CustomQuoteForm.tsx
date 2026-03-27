import { useState } from "react";
import type { AdminCreateCustomQuoteReq } from "@/Services/adminCustomRequestService";

type QuoteRow = {
  description: string;
  quantity: number;
  unitPriceExVat: number;
  vatRatePercent: number;
};

type Props = {
  onSubmit: (body: AdminCreateCustomQuoteReq) => void;
  onCancel: () => void;
  loading?: boolean;
};

const defaultRow = (): QuoteRow => ({
  description: "",
  quantity: 1,
  unitPriceExVat: 0,
  vatRatePercent: 25,
});

export default function CustomQuoteForm({ onSubmit, onCancel, loading }: Props) {
  const [title, setTitle] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [expiresAtUtc, setExpiresAtUtc] = useState("");
  const [rows, setRows] = useState<QuoteRow[]>([defaultRow()]);

  function updateRow(index: number, patch: Partial<QuoteRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, defaultRow()]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body: AdminCreateCustomQuoteReq = {
      title: title.trim(),
      customerMessage: customerMessage.trim() ? customerMessage.trim() : null,
      internalNote: internalNote.trim() ? internalNote.trim() : null,
      expiresAtUtc: expiresAtUtc ? new Date(expiresAtUtc).toISOString() : null,
      items: rows.map((row) => ({
        description: row.description.trim(),
        quantity: Number(row.quantity),
        unitPriceExVat: Number(row.unitPriceExVat),
        vatRatePercent: Number(row.vatRatePercent),
      })),
    };

    onSubmit(body);
  }

  return (
    <form className="admin-card admin-form" onSubmit={handleSubmit}>
      <div className="admin-card-header admin-card-header--split">
        <h2>Skapa offert</h2>
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Avbryt
          </button>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Sparar..." : "Spara offert"}
          </button>
        </div>
      </div>

      <div className="admin-form-grid">
        <label>
          <span>Titel</span>
          <input
            className="admin-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Giltig till</span>
          <input
            className="admin-input"
            type="date"
            value={expiresAtUtc}
            onChange={(e) => setExpiresAtUtc(e.target.value)}
          />
        </label>

        <label className="admin-form-grid__full">
          <span>Kundmeddelande</span>
          <textarea
            className="admin-textarea"
            rows={4}
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
          />
        </label>

        <label className="admin-form-grid__full">
          <span>Intern anteckning</span>
          <textarea
            className="admin-textarea"
            rows={3}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
          />
        </label>
      </div>

      <div className="admin-quote-rows">
        <div className="admin-card-header admin-card-header--split">
          <h3>Offertrader</h3>
          <button type="button" className="btn btn-secondary" onClick={addRow}>
            Lägg till rad
          </button>
        </div>

        {rows.map((row, index) => (
          <div key={index} className="admin-quote-row">
            <input
              className="admin-input"
              placeholder="Beskrivning"
              value={row.description}
              onChange={(e) => updateRow(index, { description: e.target.value })}
              required
            />

            <input
              className="admin-input"
              type="number"
              min={1}
              step={1}
              value={row.quantity}
              onChange={(e) => updateRow(index, { quantity: Number(e.target.value) })}
              required
            />

            <input
              className="admin-input"
              type="number"
              min={0}
              step="0.01"
              value={row.unitPriceExVat}
              onChange={(e) => updateRow(index, { unitPriceExVat: Number(e.target.value) })}
              required
            />

            <select
              className="admin-select"
              value={row.vatRatePercent}
              onChange={(e) => updateRow(index, { vatRatePercent: Number(e.target.value) })}
            >
              <option value={25}>25%</option>
              <option value={12}>12%</option>
              <option value={6}>6%</option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => removeRow(index)}
              disabled={rows.length <= 1}
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}