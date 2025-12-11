import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = {
  productId: number;
  name: string;
  priceExVat: number; // UI-visning; server räknar pris och moms på riktigt
  quantity: number;
  imgUrl?: string;
};

type CartState = {
  cartId: string; 
  items: CartItem[];
};

type Action =
  | { type: "ADD_ITEM"; payload: { item: Omit<CartItem, "quantity">; qty?: number } }
  | { type: "SET_QTY"; payload: { productId: number; quantity: number } }
  | { type: "REMOVE_ONE"; payload: { productId: number } }
  | { type: "REMOVE_ALL"; payload: { productId: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };

const STORAGE_KEY = "pallshoppen:cart:v2";

function uuid(): string {
  return ([1e7] as any+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(c:any)=>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function isValidItem(x: any): x is CartItem {
  return x
    && Number.isFinite(Number(x.productId))
    && typeof x.name === "string"
    && Number.isFinite(Number(x.priceExVat))
    && Number.isFinite(Number(x.quantity));
}

function isValidState(maybe: unknown): maybe is CartState {
  if (!maybe || typeof maybe !== "object") return false;
  const s = maybe as any;
  if (typeof s.cartId !== "string") return false;
  if (!Array.isArray(s.items)) return false;
  return s.items.every(isValidItem);
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
  return { cartId: uuid(), items: [] };
}

function coerceItem(i: Omit<CartItem, "quantity">): Omit<CartItem, "quantity"> {
  const productId = Number(i.productId);
  const priceExVat = Number(i.priceExVat);
  return {
    productId: Number.isFinite(productId) ? productId : 0,
    name: String(i.name ?? ""),
    priceExVat: Number.isFinite(priceExVat) ? priceExVat : 0,
    imgUrl: i.imgUrl ? String(i.imgUrl) : undefined,
  };
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, qty = 1 } = action.payload;
      const safe = coerceItem(item);
      const add = Math.max(1, Number(qty) || 1);

      const i = state.items.findIndex(x => x.productId === safe.productId);
      if (i === -1) {
        return { ...state, items: [...state.items, { ...safe, quantity: add }] };
      }
      const next = [...state.items];
      next[i] = { ...next[i], quantity: next[i].quantity + add };
      return { ...state, items: next };
    }

    case "SET_QTY": {
      const { productId, quantity } = action.payload;
      const q = Math.max(0, Math.floor(Number(quantity) || 0));
      if (q === 0) {
        return { ...state, items: state.items.filter(x => x.productId !== productId) };
      }
      const i = state.items.findIndex(x => x.productId === productId);
      if (i === -1) return state; 
      const next = [...state.items];
      next[i] = { ...next[i], quantity: q };
      return { ...state, items: next };
    }

    case "REMOVE_ONE": {
      const { productId } = action.payload;
      const next = state.items
        .map(x => (x.productId === productId ? { ...x, quantity: x.quantity - 1 } : x))
        .filter(x => x.quantity > 0);
      return { ...state, items: next };
    }

    case "REMOVE_ALL":
      return { ...state, items: state.items.filter(x => x.productId !== action.payload.productId) };

    case "CLEAR":
      return { ...state, items: [] };

    case "HYDRATE":
      return {
        cartId: action.payload.cartId || state.cartId || uuid(),
        items: Array.isArray(action.payload.items) ? action.payload.items : [],
      };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  cartId: string;
  totalExVat: number;
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
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
        const parsed = e.newValue ? JSON.parse(e.newValue) : { cartId: state.cartId, items: [] };
        if (isValidState(parsed)) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      } catch {
      }
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
      addItem: (item: Omit<CartItem, "quantity">, qty = 1) =>
        dispatch({ type: "ADD_ITEM", payload: { item, qty } }),
      setQuantity: (productId: number, quantity: number) =>
        dispatch({ type: "SET_QTY", payload: { productId, quantity } }),
      removeOne: (productId: number) =>
        dispatch({ type: "REMOVE_ONE", payload: { productId } }),
      removeAll: (productId: number) =>
        dispatch({ type: "REMOVE_ALL", payload: { productId } }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state, totalExVat, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("must wrapp with cartProvider");
  return ctx;
}
