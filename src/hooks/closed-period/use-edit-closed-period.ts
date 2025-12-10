import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface EditClosedPeriodInput {
  id: string;
  from: Date;
  to: Date;
}

export const useEditClosedPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EditClosedPeriodInput) => {
      return await pb.collection("closedPeriods").update(id, data);
    },
    onSuccess: () => {
      toast.success("Closed period updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["closedPeriods"] });
    },
    onError: (e) => {
      toast.error("Error updating Closed Period: " + e.message);
    },
  });
};