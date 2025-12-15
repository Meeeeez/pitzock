import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import type { TBusiness } from "@/lib/types/business";

export const useEditBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<TBusiness>) => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb.collection("businesses").update(businessId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    }
  });
};