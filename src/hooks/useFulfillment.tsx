import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminFulfillmentQk } from "@/constants/queryKeys";
import {
  getFulfillmentById,
  listFulfillmentQueue,
  markFulfilled,
  reopenFulfillment,
  setFulfillmentNote,
  type AdminFulfillmentQueue,
  type AdminFulfillmentOrder,
  type FulfillmentStatus,
} from "@/Services/adminFulfillmentService";

const PAGE_SIZE = 20;

export function useAdminFulfillmentList(
  page: number,
  query: string,
  fulfillmentStatus: FulfillmentStatus | undefined,
  overdueOnly: boolean
) {
  const normalizedQuery = query.trim() || undefined;

  return useQuery<AdminFulfillmentQueue>({
    queryKey: adminFulfillmentQk.list(
      page,
      PAGE_SIZE,
      normalizedQuery ?? "",
      overdueOnly,
      fulfillmentStatus ?? ""
    ),
    queryFn: () =>
      listFulfillmentQueue({
        page,
        pageSize: PAGE_SIZE,
        query: normalizedQuery,
        overdueOnly,
        fulfillmentStatus,
      }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
export function useAdminFulfillmentDetails(orderId: number | null) {
  return useQuery<AdminFulfillmentOrder>({
    queryKey: orderId ? adminFulfillmentQk.detail(orderId) : ["admin-fulfillment", "details", "empty"],
    queryFn: () => getFulfillmentById(orderId!),
    enabled: orderId!== null,
    staleTime: 10_000,
  });
}
export function useMarkFulfilled() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string | null }) =>
      markFulfilled(id, { note: note?.trim() || null }),
    onSuccess: async (_, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: adminFulfillmentQk.all }),
        qc.invalidateQueries({ queryKey: adminFulfillmentQk.detail(vars.id) }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      ]);
    },
  });
}
export function useReopenFulfillment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string | null }) =>
      reopenFulfillment(id, { note: note?.trim() || null }),
    onSuccess: async (_, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: adminFulfillmentQk.all }),
        qc.invalidateQueries({ queryKey: adminFulfillmentQk.detail(vars.id) }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard"] }),
      ]);
    },
  });
}
export function useSetFulfillmentNote() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string | null }) =>
      setFulfillmentNote(id, { note: note?.trim() || null }),
    onSuccess: async (_, vars) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: adminFulfillmentQk.all }),
        qc.invalidateQueries({ queryKey: adminFulfillmentQk.detail(vars.id) }),
      ]);
    },
  });
}