import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import pb from '@/lib/pocketbase';

interface CreateMergeGroupInput {
  areaId: string;
  members: string[];
  capacity: number;
}

export const useCreateMergeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMergeGroupInput) => {
      return await pb.send("/api/create-merge-group", {
        method: "POST",
        body: data,
      });
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
