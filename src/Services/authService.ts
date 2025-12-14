import { api } from "@/lib/http";
import * as sdk from '@/api/sdk.gen';


export async function login(email: string, password: string) {
  const res = await sdk.postAuthLogin({
    client: api,
    body: { email, password }
  });
  if (res.error) throw res.error;
  return res.data!;
}

export async function register(displayName: string, email: string, password: string) {
  const res = await sdk.postAuthRegister({
    client: api,
    body: {displayName, email, password }
  });
  if (res.error) throw res.error;
  return res.data!;
}