import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";
import type * as apiTypes from "@/api/types.gen";

export type AdminCustomRequestListItem = apiTypes.AdminCustomRequestListItemDto;
export type AdminCustomRequestDetails = apiTypes.AdminCustomRequestDetailsDto;
export type AdminCustomQuoteDetails = apiTypes.AdminCustomQuoteDetailsDto;
export type AdminCreateCustomQuoteReq = apiTypes.AdminCreateCustomQuoteDto;
export type AdminCustomRequestPaged = apiTypes.PagedResultOfAdminCustomRequestListItemDto;

export type AdminCustomRequestListParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  status?: string;
};

export async function adminListCustomRequests(
  params: AdminCustomRequestListParams = {}
): Promise<AdminCustomRequestPaged> {
  const res = await sdk.getApiAdminCustomRequests({
    client: api,
    query: {
      page: params.page,
      pageSize: params.pageSize,
      query: params.query,
      status: params.status,
    },
  });

  if (res.error) throw res.error;

  return (
    res.data ?? {
      items: [],
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      totalItems: 0,
      totalPages: 0,
    }
  );
}

export async function adminGetCustomRequestById(
  id: number
): Promise<AdminCustomRequestDetails> {
  const res = await sdk.getApiAdminCustomRequestsById({
    client: api,
    path: { id },
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function adminCreateCustomQuote(
  customRequestId: number,
  body: AdminCreateCustomQuoteReq
): Promise<AdminCustomQuoteDetails> {
  const res = await sdk.postApiAdminCustomRequestsByIdQuotes({
    client: api,
    path: { id: customRequestId },
    body,
  });

  if (res.error) throw res.error;
  return res.data!;
}

export async function adminSendCustomQuote(quoteId: number): Promise<void> {
  const res = await sdk.postApiAdminCustomQuotesByIdSend({
    client: api,
    path: { id: quoteId },
  });

  if (res.error) throw res.error;
}