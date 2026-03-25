export type RequestOrderFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  file: File | null;
};

export type RequestOrderFormErrors = Partial<Record<keyof RequestOrderFormState, string>>;
export type RequestOrderTouchedState = Partial<Record<keyof RequestOrderFormState, boolean>>;

export const REQUEST_ORDER_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const REQUEST_ORDER_ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export function validateRequestOrderField<K extends keyof RequestOrderFormState>(
  field: K,
  value: RequestOrderFormState[K]
): string {
  switch (field) {
    case "name": {
      const name = String(value).trim();

      if (!name) return "Namn måste fyllas i.";
      if (name.length > 100) return "Namn får vara max 100 tecken.";
      return "";
    }

    case "email": {
      const email = String(value).trim();

      if (!email) return "E-post måste fyllas i.";
      if (email.length > 200) return "E-post får vara max 200 tecken.";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return "Ange en giltig e-postadress.";

      return "";
    }

    case "phone": {
      const phone = String(value).trim();

      if (!phone) return "";
      if (phone.length > 50) return "Telefonnummer får vara max 50 tecken.";

      const phoneRegex = /^[0-9+\-\s()]*$/;
      if (!phoneRegex.test(phone)) {
        return "Telefonnummer får bara innehålla siffror, mellanslag och vanliga tecken som + - ( ).";
      }

      return "";
    }

    case "message": {
      const message = String(value).trim();

      if (!message) return "Beskrivning måste fyllas i.";
      if (message.length > 4000) return "Beskrivningen får vara max 4000 tecken.";

      return "";
    }

    case "file": {
      const file = value as File | null;

      if (!file) return "";
      if (!REQUEST_ORDER_ALLOWED_FILE_TYPES.includes(file.type)) {
        return "Ogiltigt filformat. Tillåtna format är PDF, PNG, JPG, JPEG och WEBP.";
      }

      if (file.size > REQUEST_ORDER_MAX_FILE_SIZE) {
        return "Filen är för stor. Maxstorlek är 10 MB.";
      }

      return "";
    }

    default:
      return "";
  }
}

export function validateRequestOrderForm(
  form: RequestOrderFormState
): RequestOrderFormErrors {
  return {
    name: validateRequestOrderField("name", form.name),
    email: validateRequestOrderField("email", form.email),
    phone: validateRequestOrderField("phone", form.phone),
    message: validateRequestOrderField("message", form.message),
    file: validateRequestOrderField("file", form.file),
  };
}

export function requestOrderHasErrors(errors: RequestOrderFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}