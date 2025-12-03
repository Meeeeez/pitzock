import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface EditAreaInput {
  id: string;
  name?: string;
  allowsPets?: boolean;
  isActive?: boolean;
}

export const useEditArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EditAreaInput) => {
      return await pb.collection("areas").update(id, data);
    },
    onSuccess: () => {
      toast.success("Area updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
    onError: () => {
      toast.error("Error updating area. Please try again.");
    },
  });
};