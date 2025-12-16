import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface EditHolidaysInput {
  id: string;
  from: Date;
  to: Date;
}

export const useEditHolidays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EditHolidaysInput) => {
      return await pb.collection("holidays").update(id, data);
    },
    onSuccess: () => {
      toast.success("Holidays updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
    onError: (e) => {
      toast.error("Error updating holidays: " + e.message);
    },
  });
};