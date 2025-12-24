import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface EditStationWalkInAssignmentInput {
  walkInId: string;
  stationId?: string;
  mergeGroupId?: string;
}

export const useEditStationWalkInAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ walkInId, stationId, mergeGroupId }: EditStationWalkInAssignmentInput) => {
      await pb.send("/api/reassign-station-walk-in", {
        method: "POST",
        body: {
          walkInId,
          stationId,
          mergeGroupId,
        },
      });
    },
    onSuccess: () => {
      toast.success("Walk-In updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["walk-ins"] });
      queryClient.invalidateQueries({ queryKey: ["fittingStations"] });
    },
    onError: (e) => {
      toast.error("Error updating Walk-In: " + e.message);
    },
  });
};