import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login, logout, register } from "@/Services/authService";
import { qk } from "./queryKeys";


export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: ({ signal }) => getMe({ signal }),
    staleTime: 30_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      login(body.email, body.password),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.meProfile }); 
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn:(body: {
      displayName:string;
      email:string;
      password:string
    }) =>
      register(body.displayName, body.email, body.password)
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: qk.me });
      qc.removeQueries({ queryKey: qk.meProfile });
    },
  });
}

