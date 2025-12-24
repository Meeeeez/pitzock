import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface EditStationReservationAssignmentInput {
  reservationId: string;
  stationId?: string;
  mergeGroupId?: string;
}

export const useEditStationReservationAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reservationId, stationId, mergeGroupId }: EditStationReservationAssignmentInput) => {
      await pb.send("/api/reassign-station-reservation", {
        method: "POST",
        body: {
          reservationId,
          stationId,
          mergeGroupId,
        },
      });
    },
    onSuccess: () => {
      toast.success("Reservation updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["fittingStations"] });
    },
    onError: (e) => {
      toast.error("Error updating reservation: " + e.message);
    },
  });
};