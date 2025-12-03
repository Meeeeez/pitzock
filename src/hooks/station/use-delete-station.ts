import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

export const useDeleteStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection("stations").delete(id);
    },
    onSuccess: () => {
      toast.success("Station deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: () => {
      toast.error("Error deleting station. Please try again.");
    },
  });
};
