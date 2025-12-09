import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/http";

export type MeDto = { email: string; displayName?: string; roles: string[] };
type LoginRes = { expiresAt: string };

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await api.request<MeDto>({
        method: "GET",
        url: "/users/me",
      });
      if (error) throw error;
   
      return (data as unknown) as MeDto;
    },
    staleTime: 30_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const { data, error } = await api.request<LoginRes>({
        method: "POST",
        url: "/auth/login",
        body, 
      });
      if (error) throw error;
      return (data as unknown) as LoginRes;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await api.request({
        method: "POST",
        url: "/auth/logout",
      });
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.removeQueries({ queryKey: ["me"] }),
  });
}
