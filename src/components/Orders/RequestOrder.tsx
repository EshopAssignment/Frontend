import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { createCustomRequest } from "@/Services/customRequestService";
import {
  type RequestOrderFormErrors,
  type RequestOrderFormState,
  type RequestOrderTouchedState,
  requestOrderHasErrors,
  validateRequestOrderField,
  validateRequestOrderForm,
} from "@/helpers/Validation/requestOrderValidation";

const initialState: RequestOrderFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  file: null,
};

const RequestOrder = () => {
  const [form, setForm] = useState<RequestOrderFormState>(initialState);
  const [errors, setErrors] = useState<RequestOrderFormErrors>({});
  const [touched, setTouched] = useState<RequestOrderTouchedState>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target;
    const field = id as keyof RequestOrderFormState;

    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (touched[field]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: validateRequestOrderField(field, next[field]),
        }));
      }

      return next;
    });

    if (isSuccess) setIsSuccess(false);
    if (submitError) setSubmitError("");
  }

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.id as keyof RequestOrderFormState;

    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateRequestOrderField(field, form[field]),
    }));
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    setForm((prev) => {
      const next = {
        ...prev,
        file,
      };

      if (touched.file) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: validateRequestOrderField("file", next.file),
        }));
      }

      return next;
    });

    if (isSuccess) setIsSuccess(false);
    if (submitError) setSubmitError("");
  }

  function handleFileBlur() {
    setTouched((prev) => ({
      ...prev,
      file: true,
    }));

    setErrors((prev) => ({
      ...prev,
      file: validateRequestOrderField("file", form.file),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextTouched: RequestOrderTouchedState = {
      name: true,
      email: true,
      phone: true,
      message: true,
      file: true,
    };

    const nextErrors = validateRequestOrderForm(form);

    setTouched(nextTouched);
    setErrors(nextErrors);
    setSubmitError("");
    setIsSuccess(false);

    if (requestOrderHasErrors(nextErrors)) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createCustomRequest({
        Name: form.name.trim(),
        Email: form.email.trim(),
        Phone: form.phone.trim(),
        Message: form.message.trim(),
        File: form.file ?? undefined,
      });

      setForm(initialState);
      setErrors({});
      setTouched({});
      setIsSuccess(true);
    } catch {
      setSubmitError("Något gick fel när förfrågan skulle skickas. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const nameError = touched.name ? errors.name : "";
  const emailError = touched.email ? errors.email : "";
  const phoneError = touched.phone ? errors.phone : "";
  const messageError = touched.message ? errors.message : "";
  const fileError = touched.file ? errors.file : "";

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

      <form className="form" onSubmit={handleSubmit} noValidate>
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
              className={`input ${nameError ? "input-error" : ""}`}
              type="text"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "name-error" : undefined}
            />
            {nameError && (
              <p id="name-error" className="error" role="alert">
                {nameError}
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="email" className="label">
              E-post
            </label>
            <input
              id="email"
              className={`input ${emailError ? "input-error" : ""}`}
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p id="email-error" className="error" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="phone" className="label">
              Telefonnummer
            </label>
            <input
              id="phone"
              className={`input ${phoneError ? "input-error" : ""}`}
              type="tel"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? "phone-error" : undefined}
            />
            {phoneError && (
              <p id="phone-error" className="error" role="alert">
                {phoneError}
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="message" className="label">
              Beskrivning
            </label>
            <textarea
              id="message"
              className={`input textarea ${messageError ? "input-error" : ""}`}
              rows={6}
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!messageError}
              aria-describedby={messageError ? "message-error" : undefined}
            />
            {messageError && (
              <p id="message-error" className="error" role="alert">
                {messageError}
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="file" className="label">
              Ritning eller skiss
            </label>
            <input
              id="file"
              className={`input ${fileError ? "input-error" : ""}`}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              onBlur={handleFileBlur}
              aria-invalid={!!fileError}
              aria-describedby={fileError ? "file-error" : "file-help"}
            />

            <p id="file-help" className="field-help">
              Tillåtna format: PDF, PNG, JPG, JPEG, WEBP. Max 10 MB.
            </p>

            {form.file && !fileError && (
              <p className="file-name">Vald fil: {form.file.name}</p>
            )}

            {fileError && (
              <p id="file-error" className="error" role="alert">
                {fileError}
              </p>
            )}
          </div>

          {submitError && (
            <p className="form-error" role="alert">
              {submitError}
            </p>
          )}

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