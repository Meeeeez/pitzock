import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";
import type { TClient } from "@/lib/types/client";

interface CreateClientInput {
  name: string;
  email: string;
  notes?: string;
}

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized!");
      return await pb.collection("clients").create({
        businessId,
        ...data,
      }) as TClient;
    },
    onSuccess: () => {
      toast.success("Client created successfully!");
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (e) => {
      toast.error("Error creating client: " + e.message);
    }
  });
};