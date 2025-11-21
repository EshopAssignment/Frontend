import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import type { ProductDto } from "../Services/productService";

export type CartItem = {
    productId: number;
    name: string;
    price: number;
    quantity: number;
};

type CartState = {
  items: CartItem[];
};


type CartAction = 
| {type: "ADD_ITEM"; payload:{product: ProductDto} }
| {type: "REMOVE_ALL"; payload:{productId: number}}
| {type: "REMOVE_ONE"; payload:{productId: number}}
| {type: "CLEAR"};

const CartContext = createContext<{
    state: CartState;
    addItem: (product: ProductDto) => void;
    removeOne: (productId: number) => void;
    removeAll: (productId: number) => void;
    clear:() => void;
    total: number;
}>({
    state: {items: []},
    addItem: () => {},
    removeOne:() => {},
    removeAll:() => {},
    clear:() => {},
    total:0,
});

function cartReducer(state: CartState, action: CartAction) : CartState {

    switch (action.type) {
        case "ADD_ITEM": {
            const {product}  = action.payload;
            const existing = state.items.find(i => i.productId === product.id);
            
            if(!existing)
            {
                return{
                    ...state,
                    items:[
                        ...state.items,
                        {
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1, 
                        },
                    ],
                };
            }

            return {
                ...state, 
                items: state.items.map(i => 
                    i.productId === product.id
                    ? { ...i, quantity: i.quantity +1}
                    : i 
                )
            };
        }

        case "REMOVE_ONE":{
            const { productId } = action.payload;
            const existing = state.items.find (i => i.productId === productId);
            if (!existing) return state;

            if (existing.quantity === 1) {
                return {
                    ...state,
                    items: state.items.filter(i => i.productId),
                };
            }

            return {
                ...state, 
                items: state.items.map(i => 
                    i.productId === productId
                    ?  {...i, quantity: i.quantity -1 }
                    : i
                ),
            };
        }

        case "REMOVE_ALL":{
            const { productId } = action.payload;
            return{
                ...state,
                items: state.items.filter(i => i.productId !== productId),
            };
        }

        case "CLEAR":
            return { items: []}

        default:
            return state;
    }
}

export function CartProvider({children}: {children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {items: [] });

    const total = useMemo(
        () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [state.items]
    );

    const value = {
        state,
        addItem: (product: ProductDto) => 
            dispatch({ type: "ADD_ITEM", payload: {product} }),
        removeOne: (productId: number) =>
            dispatch ({ type: "REMOVE_ONE", payload: {productId} }),
        removeAll: (productId: number) =>
            dispatch ({ type: "REMOVE_ALL", payload: {productId} }),
        clear: () => dispatch({type: "CLEAR"}),
        total,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext);
}