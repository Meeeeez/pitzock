import pb from '@/lib/pocketbase';
import { useQuery } from '@tanstack/react-query';

export function useListStationMergesByStation(stationId: string) {
  return useQuery({
    queryKey: ['stations', stationId],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb.collection('stationMerges').getFullList({
        filter: `stationId = "${stationId}"`,
      });
    }
  });
};