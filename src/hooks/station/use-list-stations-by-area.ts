import pb from '@/lib/pocketbase';
import type { TStation } from '@/lib/types/station';
import { useQuery } from '@tanstack/react-query';

export function useListStationsByArea(areaId: string) {
  return useQuery({
    queryKey: ['stations', areaId],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb.collection('stations').getFullList<TStation>({
        expand: "areaId",
        filter: `areaId.businessId = "${businessId}" && areaId = "${areaId}"`,
      });
    }
  });
};