const base = import.meta.env.VITE_API_URL;
if (!base) {
  throw new Error("VITE_API_URL saknas. Lägg in i .env och starta om Vite.");
}
export const API_ORIGIN = String(base).replace(/\/+$/, "");
