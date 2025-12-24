import pb from "@/lib/pocketbase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface WalkInCreateProps {
  startsAt: Date;
  endsAt: Date;
  stationAssignment: string;
}

export const useCreateWalkIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WalkInCreateProps) => {
      return await pb.send("/api/create-walk-in", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast.success("Walk-In created successfully!");
      queryClient.invalidateQueries({ queryKey: ["walk-ins"] });
      queryClient.invalidateQueries({ queryKey: ["fittingStations"] });
    },
    onError: (e: any) => {
      toast.error("Error creating walk-in: " + e.message);
    },
  });
};