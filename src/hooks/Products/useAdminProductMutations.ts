import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adminCreateProduct,
  adminToggleActive,
  adminUpdateProduct,
  type AdminCreateReq,
  type AdminUpdateReq,
} from "@/Services/adminProductService";
import { adminProductQk } from "@/constants/queryKeys";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export function useAdminProductMutations(options?: {
  onCreated?: () => void;
  onUpdated?: () => void;
}) {
  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: (body: AdminCreateReq) => adminCreateProduct(body),
    onSuccess: async () => {
      toast.success("Produkt skapad.");
      options?.onCreated?.();
      await qc.invalidateQueries({ queryKey: adminProductQk.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte skapa produkt."));
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUpdateReq }) =>
      adminUpdateProduct(id, body),
    onSuccess: async (_updated, variables) => {
      toast.success("Produkt uppdaterad.");
      options?.onUpdated?.();

      await Promise.all([
        qc.invalidateQueries({ queryKey: adminProductQk.all }),
        qc.invalidateQueries({ queryKey: adminProductQk.detail(variables.id) }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte uppdatera produkt."));
    },
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminToggleActive(id, isActive),
    onSuccess: async (_data, variables) => {
      toast.success(variables.isActive ? "Produkt aktiverad." : "Produkt inaktiverad.");
      await qc.invalidateQueries({ queryKey: adminProductQk.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte ändra aktiv status."));
    },
  });

  return {
    createMut,
    updateMut,
    toggleMut,
    busy: createMut.isPending || updateMut.isPending || toggleMut.isPending,
  };
}