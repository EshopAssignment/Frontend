import { api } from "@/lib/http";
import * as sdk from '@/api/sdk.gen';

export type LoginRes = NonNullable<Awaited<ReturnType<typeof sdk.postAuthLogin>>["data"]>;
export type RegisterRes = NonNullable<Awaited<ReturnType<typeof sdk.postAuthRegister>>["data"]>;
export type MeApiDto = NonNullable<Awaited<ReturnType<typeof sdk.getApiMe>>["data"]>;

export type MeDto = {
  email:string;
  displayName?: string | null;
  roles: string [];
};

export async function login(email: string, password: string): Promise<LoginRes> {
  const res = await sdk.postAuthLogin({
    client: api,
    body:{email, password},
  });
  if (res.error) throw res.error;
  return res.data!;
}

export async function register(displayName: string, email: string, password: string): Promise<RegisterRes>{
  const res = await sdk.postAuthRegister({
    client: api,
    body:{displayName, email, password},
  });
  if (res.error) throw res.error;
  return res.data!;
}

export async function logout():Promise<void>{
  const res = await sdk.postAuthLogout({client: api});
  if (res.error) throw res.error;
}

export async function getMe(opts?: {signal?: AbortSignal }): Promise<MeDto> {
  const res = await sdk.getApiMe({client: api, signal: opts?.signal });
  if (res.error) throw res.error;

  const d = res.data!;
  return {
    email:d.email,
    displayName: d.displayName ?? null,
    roles:d.roles ?? [],
  };
}