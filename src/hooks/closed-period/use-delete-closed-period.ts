import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

export const useDeleteClosedPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection("closedPeriods").delete(id);
    },
    onSuccess: () => {
      toast.success("Closed Period deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["closedPeriods"] });
    },
    onError: (e) => {
      toast.error("Error deleting closed period: " + e.message);
    },
  });
};
