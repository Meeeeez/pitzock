import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface CreateAreaInput {
  name: string;
  allowsPets: boolean;
  isActive: boolean;
}

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAreaInput) => {
      return await pb.collection("areas").create({
        ...data,
        businessId: pb.authStore.record?.id
      });
    },
    onSuccess: () => {
      toast.success("Area created successfully!");
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
    onError: (e) => {
      toast.error("Error creating area: " + e.message);
    }
  });
};