import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface CreateClosedPeriodInput {
  from: Date;
  to: Date;
}

export const useCreateClosedPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClosedPeriodInput) => {
      return await pb.collection("closedPeriods").create({
        ...data,
        businessId: pb.authStore.record?.id
      });
    },
    onSuccess: () => {
      toast.success("Successfully created closed period!");
      queryClient.invalidateQueries({ queryKey: ['closedPeriods'] });
    },
    onError: (e) => {
      toast.error("Error creating closed period: " + e.message);
    }
  });
};