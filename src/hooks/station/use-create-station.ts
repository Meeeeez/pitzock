import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";
import type { TStation } from "@/lib/types/station";

type TStationCreate = Omit<TStation, 'id' | 'created' | 'updated'>

export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TStationCreate) => {
      return await pb.collection("stations").create({
        ...data,
        businessId: pb.authStore.record?.id
      });
    },
    onSuccess: () => {
      toast.success("Station created successfully!");
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
    onError: (e) => {
      toast.error("Error creating station. " + e.message);
    }
  });
};