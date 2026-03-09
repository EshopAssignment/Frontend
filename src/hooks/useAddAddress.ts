import type { UpsertAddressDto } from "@/api/types.gen";
import { addAddress } from "@/Services/profileService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meQk } from "@/constants/queryKeys";

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpsertAddressDto) => addAddress(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQk.profile() });
    },
  });
}