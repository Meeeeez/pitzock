import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection("areas").delete(id);
    },
    onSuccess: () => {
      toast.success("Area deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
    onError: () => {
      toast.error("Error deleting area. Please try again.");
    },
  });
};
