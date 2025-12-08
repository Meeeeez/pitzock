import pb from '@/lib/pocketbase';
import type { TStation } from '@/lib/types/station';
import { useQuery } from '@tanstack/react-query';

export function useListStations() {
  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb.collection('stations').getFullList<TStation>({
        expand: "areaId",
        filter: `areaId.businessId = "${businessId}"`,
      });
    }
  });
};