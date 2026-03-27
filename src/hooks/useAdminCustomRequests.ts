import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  adminCreateCustomQuote,
  adminGetCustomRequestById,
  adminListCustomRequests,
  adminSendCustomQuote,
  type AdminCreateCustomQuoteReq,
  type AdminCustomRequestListParams,
} from "@/Services/adminCustomRequestService";
import { adminCustomRequestQk } from "@/constants/queryKeys";
import { getErrorMessage } from "@/helpers/getErrorMessage";

export function useAdminCustomRequestList(params: AdminCustomRequestListParams) {
    return useQuery({
        queryKey: adminCustomRequestQk.list(params),
        queryFn: () => adminListCustomRequests(params),
        placeholderData: keepPreviousData,
        staleTime: 10_000,
    });
}

export function useAdminCustomRequest(id: number | null) {
    return useQuery({
        queryKey: id != null ? adminCustomRequestQk.detail(id) : ["admin-custom-requests", "detail", "none"],
        queryFn: () => adminGetCustomRequestById(id!),
        enabled: id != null,
        staleTime: 10_000,
    });
}


export function useAdminCustomRequestMutations(selectedId: number | null) {
  const qc = useQueryClient();

  const createQuoteMut = useMutation({
    mutationFn: ({ customRequestId, body }: { customRequestId: number; body: AdminCreateCustomQuoteReq }) =>
      adminCreateCustomQuote(customRequestId, body),
    onSuccess: async (_data, vars) => {
      toast.success("Offert skapad.");
      await Promise.all([
        qc.invalidateQueries({ queryKey: adminCustomRequestQk.all }),
        qc.invalidateQueries({ queryKey: adminCustomRequestQk.detail(vars.customRequestId) }),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte skapa offert."));
    },
  });

  const sendQuoteMut = useMutation({
    mutationFn: (quoteId: number) => adminSendCustomQuote(quoteId),
    onSuccess: async () => {
      toast.success("Offert skickad.");
      await Promise.all([
        qc.invalidateQueries({ queryKey: adminCustomRequestQk.all }),
        ...(selectedId != null
          ? [qc.invalidateQueries({ queryKey: adminCustomRequestQk.detail(selectedId) })]
          : []),
      ]);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Kunde inte skicka offert."));
    },
  });

  return {
    createQuoteMut,
    sendQuoteMut,
    busy: createQuoteMut.isPending || sendQuoteMut.isPending,
  };
}