import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

export const useDeleteHolidays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await pb.collection("holidays").delete(id);
    },
    onSuccess: () => {
      toast.success("Holidays deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
    onError: (e) => {
      toast.error("Error deleting holidays: " + e.message);
    },
  });
};
