import { api } from "@/lib/http"
import * as sdk from "@/api/sdk.gen"

export async function setCartReservation(
  cartId: string,
  productId: number,
  quantity: number,
  ttlMinutes = 30
): Promise<void> {
    const res = await sdk.putApiReservationApiCartReservations({
        client: api,
        body: {
            cartId,
            productId,
            quantity,
            reservationTtlMinutes: ttlMinutes,
        },
    });
    if (res.error) throw res.error;
}
