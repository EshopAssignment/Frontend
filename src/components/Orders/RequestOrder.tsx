import { useState, type ChangeEvent, type FormEvent } from "react";
import { createCustomRequest } from "@/Services/customRequestService";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  file: File | null;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  file: null,
};

const RequestOrder = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    setForm((prev) => ({
      ...prev,
      file,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setIsSuccess(false);

    await createCustomRequest({
      Name: form.name,
      Email: form.email,
      Phone: form.phone,
      Message: form.message,
      File: form.file ?? undefined,
    });

    setForm(initialState);
    setIsSuccess(true);
    setIsSubmitting(false);
  }

  return (
    <section className="container" aria-labelledby="request-order-heading">
      <div className="request-info">
        <h2 id="request-order-heading">Hittar du inte vad du söker?</h2>
        <p>
          Vi tillverkar specialanpassade pallar efter förfrågan. Fyll i formuläret
          så återkommer vi.
        </p>
        <p>
          Har du en ritning eller skiss? Ladda upp den så blir det lättare för oss
          att hjälpa dig.
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-head">
          <h2>Special order</h2>
        </div>

        <div className="form-group custom-order-form">
          <div className="input-group">
            <label htmlFor="name" className="label">
              Namn
            </label>
            <input
              id="name"
              className="input"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="label">
              E-post
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone" className="label">
              Telefonnummer
            </label>
            <input
              id="phone"
              className="input"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="message" className="label">
              Beskrivning
            </label>
            <textarea
              id="message"
              className="input textarea"
              rows={6}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="file" className="label">
              Ritning eller skiss
            </label>
            <input
              id="file"
              className="input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
            />

            {form.file && (
              <p className="file-name">
                Vald fil: {form.file.name}
              </p>
            )}
          </div>

          {isSuccess && (
            <p className="form-success" role="status" aria-live="polite">
              Din förfrågan har skickats. Vi återkommer så snart vi kan.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Skickar..." : "Skicka"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default RequestOrder;