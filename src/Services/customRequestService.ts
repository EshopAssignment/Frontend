import { api } from "@/lib/http";
import * as sdk from "@/api/sdk.gen";

export type CreateCustomRequestBody = {
  Name: string;
  Email: string;
  Phone: string;
  Message: string;
  File?: File | undefined;
};

export async function createCustomRequest(body: CreateCustomRequestBody): Promise<void> {
  const res = await sdk.postApiCustomRequests({
    client: api,
    body,
  });

  if (res.error) throw res.error;
}