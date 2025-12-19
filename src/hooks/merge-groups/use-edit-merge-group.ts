import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";
import { toast } from "sonner";

interface EditMergeGroupInput {
  id: string;
  areaId?: string;
  capacity?: number;
  members?: string[];
}

export const useEditMergeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, areaId, capacity, members }: EditMergeGroupInput) => {
      const oldMembers = await pb.collection("mergeGroupStations").getFullList({
        filter: `mergeGroupId = "${id}"`,
      });

      // 1 Update merge group fields
      const mergeGroupUpdateData = {
        ...(areaId && { areaId }),
        ...(capacity && { capacity }),
      };
      await pb.collection("mergeGroups").update(id, mergeGroupUpdateData);

      // 2 If members are passed, replace them
      if (members) {
        // Delete old members
        await Promise.all(oldMembers.map((m) => pb.collection("mergeGroupStations").delete(m.id, { requestKey: null })));

        // Create new members
        await Promise.all(
          members.map((stationId) =>
            pb.collection("mergeGroupStations").create(
              { mergeGroupId: id, stationId },
              { requestKey: null }
            )
          )
        );
      }
    },
    onSuccess: () => {
      toast.success("Station Group updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["mergeGroups"] });
    },
    onError: (e: any) => {
      toast.error("Error updating Station Group: " + e.message);
    },
  });
};
