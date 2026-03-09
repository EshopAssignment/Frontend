import { useCart } from "@/context/CartContext";
import { toCartItem } from "@/helpers/toCartItem";
import type { ProductDto } from "@/Services/productService";
import { useState } from "react";
import toast from "react-hot-toast";

export function useAddToCart(product: ProductDto | null | undefined, available: number) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabledByStock = !product || available <= 0;
  const disabled = disabledByStock || adding;

  const clearError = () => setError(null);

  const add = async (qty = 1) => {
    if (!product) return;
    if (available <= 0) return;
    if (adding) return;

    setError(null);
    setAdding(true);

    try {
      await addItem(toCartItem(product), qty);
      toast.success("Lagd i varukorgen!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Kunde inte lägga till i varukorgen.";

      setError(message);
      toast.error("Kunde inte lägga till i varukorgen.");
    } finally {
      setAdding(false);
    }
  };

  return {
    add,
    adding,
    disabled,
    disabledByStock,
    error,
    clearError,
  };
}