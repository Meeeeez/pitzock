import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface CreateHolidaysInput {
  from: Date;
  to: Date;
}

export const useCreateHolidays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHolidaysInput) => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized!");
      return await pb.collection("holidays").create({
        ...data,
        businessId
      });
    },
    onSuccess: () => {
      toast.success("Successfully created holidays!");
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: (e) => {
      toast.error("Error creating holidays: " + e.message);
    }
  });
};