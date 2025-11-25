import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
};

type CartState = {
  items: CartItem[];
};

type Action =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; qty?: number } }
  | { type: "REMOVE_ONE"; payload: { productId: number } }
  | { type: "REMOVE_ALL"; payload: { productId: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };

const STORAGE_KEY = "pallshoppen:cart:v1";

function isValidState(maybe: unknown): maybe is CartState {
  if (!maybe || typeof maybe !== "object") return false;
  const s = maybe as any;
  if (!Array.isArray(s.items)) return false;
  return s.items.every(
    (x: any) =>
      x &&
      typeof x.productId === "number" &&
      typeof x.name === "string" &&
      typeof x.price === "number" &&
      typeof x.quantity === "number"
  );
}

function loadInitialState(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (isValidState(parsed)) return parsed;
  } catch {
  }
  return { items: [] };
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, qty = 1 } = action.payload;
      const i = state.items.findIndex(x => x.productId === item.productId);
      if (i === -1) {
        return { items: [...state.items, { ...item, quantity: Math.max(1, qty) }] };
      }
      const next = [...state.items];
      next[i] = { ...next[i], quantity: next[i].quantity + Math.max(1, qty) };
      return { items: next };
    }
    case "REMOVE_ONE": {
      const { productId } = action.payload;
      const next = state.items
        .map(x => (x.productId === productId ? { ...x, quantity: x.quantity - 1 } : x))
        .filter(x => x.quantity > 0);
      return { items: next };
    }
    case "REMOVE_ALL":
      return { items: state.items.filter(x => x.productId !== action.payload.productId) };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeOne: (productId: number) => void;
  removeAll: (productId: number) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as any, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
    }
  }, [state]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : { items: [] };
        if (isValidState(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      } catch {
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const total = useMemo(
    () => state.items.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      state,
      total,
      addItem: (item: Omit<CartItem, "quantity">, qty = 1) =>
        dispatch({ type: "ADD_ITEM", payload: { item, qty } }),
      removeOne: (productId: number) => dispatch({ type: "REMOVE_ONE", payload: { productId } }),
      removeAll: (productId: number) => dispatch({ type: "REMOVE_ALL", payload: { productId } }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


