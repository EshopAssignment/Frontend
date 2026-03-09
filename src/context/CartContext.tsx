import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { setCartReservation } from "@/Services/cartReservationService";

export type CartItem = {
  productId: number;
  name: string;
  priceExVat: number;
  vatRatePercent: number;
  quantity: number;
  imgUrl?: string;
};

type CartState = {
  cartId: string;
  items: CartItem[];
};

type Action =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; qty?: number } }
  | { type: "ADD_ONE"; payload: { productId: number } }
  | { type: "SET_QTY"; payload: { productId: number; quantity: number } }
  | { type: "REMOVE_ONE"; payload: { productId: number } }
  | { type: "REMOVE_ALL"; payload: { productId: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };

const STORAGE_KEY = "pallshoppen:cart:v2";

function createCartId(): string {
  return crypto.randomUUID();
}

function isValidItem(x: unknown): x is CartItem {
  if (!x || typeof x !== "object") return false;

  const item = x as CartItem;

  return (
    Number.isFinite(Number(item.productId)) &&
    typeof item.name === "string" &&
    Number.isFinite(Number(item.priceExVat)) &&
    Number.isFinite(Number(item.vatRatePercent)) &&
    Number.isFinite(Number(item.quantity))
  );
}

function isValidState(maybe: unknown): maybe is CartState {
  if (!maybe || typeof maybe !== "object") return false;

  const state = maybe as CartState;

  return (
    typeof state.cartId === "string" &&
    Array.isArray(state.items) &&
    state.items.every(isValidItem)
  );
}

function loadInitialState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidState(parsed)) return parsed;
    }
  } catch {
  }

  return { cartId: createCartId(), items: [] };
}

function coerceItem(i: Omit<CartItem, "quantity">): Omit<CartItem, "quantity"> {
  const productId = Number(i.productId);
  const priceExVat = Number(i.priceExVat);
  const vatRatePercent = Number((i as any).vatRatePercent);
  return {
    productId: Number.isFinite(productId) ? productId : 0,
    name: String((i as any).name ?? ""),
    priceExVat: Number.isFinite(priceExVat) ? priceExVat : 0,
    vatRatePercent: Number.isFinite(vatRatePercent) ? vatRatePercent : 25,
    imgUrl: (i as any).imgUrl ? String((i as any).imgUrl) : undefined,
  };
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, qty = 1 } = action.payload;
      const safe = coerceItem(item);
      const add = Math.max(1, Number(qty) || 1);

      const i = state.items.findIndex((x) => x.productId === safe.productId);
      if (i === -1) {
        return { ...state, items: [...state.items, { ...safe, quantity: add }] };
      }
      const next = [...state.items];
      next[i] = { ...next[i], quantity: next[i].quantity + add };
      return { ...state, items: next };
    }

    case "ADD_ONE": {
      const { productId } = action.payload;
      const i = state.items.findIndex((x) => x.productId === productId);
      if (i === -1) return state;
      const next = [...state.items];
      next[i] = { ...next[i], quantity: next[i].quantity + 1 };
      return { ...state, items: next };
    }

    case "SET_QTY": {
      const { productId, quantity } = action.payload;
      const q = Math.max(0, Math.floor(Number(quantity) || 0));
      if (q === 0) {
        return { ...state, items: state.items.filter((x) => x.productId !== productId) };
      }
      const i = state.items.findIndex((x) => x.productId === productId);
      if (i === -1) return state;
      const next = [...state.items];
      next[i] = { ...next[i], quantity: q };
      return { ...state, items: next };
    }

    case "REMOVE_ONE": {
      const { productId } = action.payload;
      const next = state.items
        .map((x) => (x.productId === productId ? { ...x, quantity: x.quantity - 1 } : x))
        .filter((x) => x.quantity > 0);
      return { ...state, items: next };
    }

    case "REMOVE_ALL":
      return { ...state, items: state.items.filter((x) => x.productId !== action.payload.productId) };

    case "CLEAR":
      return { ...state, items: [] };

    case "HYDRATE":
      return action.payload;

    default:
      return state;
  }
}

function getCurrentQty(items: CartItem[], productId: number): number {
  const it = items.find((x) => x.productId === productId);
  return it ? it.quantity : 0;
}

const CartContext = createContext<{
  state: CartState;
  cartId: string;
  totalExVat: number;
  itemCount: number;

  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => Promise<void>;
  addOne: (productId: number) => Promise<void>;
  setQuantity: (productId: number, quantity: number) => Promise<void>;
  removeOne: (productId: number) => Promise<void>;
  removeAll: (productId: number) => Promise<void>;

  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
 const [state, dispatch] = useReducer(reducer, undefined, () => loadInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : { cartId: state.cartId, items: [] };
        if (isValidState(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [state.cartId]);

  const totalExVat = useMemo(
    () => state.items.reduce((sum, x) => sum + x.priceExVat * x.quantity, 0),
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, x) => sum + x.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      state,
      cartId: state.cartId,
      totalExVat,
      itemCount,

      addItem: async (item: Omit<CartItem, "quantity">, qty = 1) => {
        const safe = coerceItem(item);
        const add = Math.max(1, Number(qty) || 1);
        if (!safe.productId) throw new Error("PRODUCT_ID_INVALID");

        const current = getCurrentQty(state.items, safe.productId);
        const desired = current + add;

        await setCartReservation(state.cartId, safe.productId, desired, 30);
        dispatch({ type: "ADD_ITEM", payload: { item: safe, qty: add } });
      },

      addOne: async (productId: number) => {
        const pid = Number(productId);
        if (!Number.isFinite(pid) || pid <= 0) throw new Error("PRODUCT_ID_INVALID");

        const current = getCurrentQty(state.items, pid);
        const desired = current + 1;

        await setCartReservation(state.cartId, pid, desired, 30);
        dispatch({ type: "ADD_ONE", payload: { productId: pid } });
      },

      setQuantity: async (productId: number, quantity: number) => {
        const pid = Number(productId);
        if (!Number.isFinite(pid) || pid <= 0) throw new Error("PRODUCT_ID_INVALID");

        const desired = Math.max(0, Math.floor(Number(quantity) || 0));

        await setCartReservation(state.cartId, pid, desired, 30);
        dispatch({ type: "SET_QTY", payload: { productId: pid, quantity: desired } });
      },

      removeOne: async (productId: number) => {
        const pid = Number(productId);
        if (!Number.isFinite(pid) || pid <= 0) throw new Error("PRODUCT_ID_INVALID");

        const current = getCurrentQty(state.items, pid);
        const desired = Math.max(0, current - 1);

        await setCartReservation(state.cartId, pid, desired, 30);
        dispatch({ type: "REMOVE_ONE", payload: { productId: pid } });
      },

      removeAll: async (productId: number) => {
        const pid = Number(productId);
        if (!Number.isFinite(pid) || pid <= 0) throw new Error("PRODUCT_ID_INVALID");

        await setCartReservation(state.cartId, pid, 0, 30);
        dispatch({ type: "REMOVE_ALL", payload: { productId: pid } });
      },

      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state, totalExVat, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
