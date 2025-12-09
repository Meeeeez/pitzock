import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";
import type { TStationMerge } from "@/lib/types/mergable-station";

type TStationMergeCreate = Omit<TStationMerge, 'id' | 'created' | 'updated'>

export const useCreateStationMerge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TStationMergeCreate) => {
      return await pb.collection("stationMerges").create(
        { ...data },
        { requestKey: null }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
    onError: (e) => {
      toast.error("Error creating station merge: " + e.message);
    }
  });
};