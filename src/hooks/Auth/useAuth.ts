import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login, logout, register } from "@/Services/authService";
import { meQk } from "@/constants/queryKeys";

export function useMe() {
  return useQuery({
    queryKey: meQk.profile(),
    queryFn: ({ signal }) => getMe({ signal }),
    staleTime: 30_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      login(body.email, body.password),

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: meQk.profile() });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: {
      displayName: string;
      email: string;
      password: string;
    }) => register(body.displayName, body.email, body.password),
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),

    onSuccess: () => {
      qc.removeQueries({ queryKey: meQk.profile() });
    },
  });
}