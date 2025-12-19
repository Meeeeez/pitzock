import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

export const useDeleteMergeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection("mergeGroups").delete(id);
    },
    onSuccess: () => {
      toast.success("Station Group deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["mergeGroups"] });
    },
    onError: (e) => {
      toast.error("Error deleting Station Group: " + e.message);
    },
  });
};
