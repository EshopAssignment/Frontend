import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login, logout, type MeDto } from "@/Services/authService";


export function useMe() {
  return useQuery<MeDto>({
    queryKey: ["me"],
    queryFn: ({ signal }) => getMe({ signal }),
    staleTime: 30_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      login(body.email, body.password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => qc.removeQueries({ queryKey: ["me"] }),
  });
}
