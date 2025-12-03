import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";
import type { TStation } from "@/lib/types/station";

type TStationUpdate = { id: TStation["id"] } & Partial<Omit<TStation, "id">>;

export const useEditStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: TStationUpdate) => {
      return await pb.collection("stations").update(id, data);
    },
    onSuccess: () => {
      toast.success("Station updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
    onError: () => {
      toast.error("Error updating station. Please try again.");
    },
  });
};