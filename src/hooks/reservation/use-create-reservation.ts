import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";
import type { TReservation, TReservationStatus } from "@/lib/types/reservation";

interface CreateReservationInput {
  clientId: string
  startsAt: Date
  endsAt: Date
  bringsPets: boolean
  notes: string
  pax: number
  status: TReservationStatus
}

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationInput) => {
      return await pb.collection("reservations").create({
        ...data,
      }) as TReservation;
    },
    onSuccess: () => {
      toast.success("Reservation created successfully!");
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (e) => {
      toast.error("Error creating reservations: " + e.message);
    }
  });
};