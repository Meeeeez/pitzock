import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

export const useDeleteWalkIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection("walkIns").delete(id);
    },
    onSuccess: () => {
      toast.success("Walk-In deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['walk-ins'] });
      queryClient.invalidateQueries({ queryKey: ["fittingStations"] });
    },
    onError: (e) => {
      toast.error("Error deleting Walk-In: " + e.message);
    }
  });
};