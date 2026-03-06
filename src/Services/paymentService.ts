import { api } from "@/lib/http";
import * as sdk from '@/api/sdk.gen';
import type * as apiTypes from "@/api/types.gen";

export async function createPaymentIntent(orderNumber: string, cartId: string) {
const res = await sdk.postApiPaymentsCreateIntent({ client: api, body: { orderNumber, cartId } });
if (res.error) throw res.error;
return res.data!;
}