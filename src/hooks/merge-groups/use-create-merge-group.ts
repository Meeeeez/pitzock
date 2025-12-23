import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import pb from '@/lib/pocketbase';
import type { TMergeGroup } from "@/lib/types/mergeGroup";

interface CreateMergeGroupInput {
  areaId: string;
  members: string[];
  capacity: number;
}

export const useCreateMergeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMergeGroupInput) => {
      let mergeGroup: TMergeGroup | null = null;
      try {
        // 1 Create the mergeGroup
        mergeGroup = await pb.collection('mergeGroups').create<TMergeGroup>({
          areaId: data.areaId,
          capacity: data.capacity,
        });

        // 2 Create the mergeGroupStation linking the mergeGroup and station
        await Promise.all(
          data.members.map((mId) =>
            pb.collection('mergeGroupStations').create(
              { mergeGroupId: mergeGroup!.id, stationId: mId },
              { requestKey: null }
            )
          )
        );
      } catch (error) {
        if (mergeGroup?.id) await pb.collection('mergeGroups').delete(mergeGroup.id);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Successfully created Station Group!");
      queryClient.invalidateQueries({ queryKey: ['mergeGroups'] });
    },
    onError: (e: any) => {
      toast.error("Error creating Station Group: " + e.message);
    },
  });
};
