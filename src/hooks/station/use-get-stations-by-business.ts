import pb from '@/lib/pocketbase';
import type { TStation } from '@/lib/types/station';
import { useQuery } from '@tanstack/react-query';

export function useGetStationsByBusiness() {
  const businessId = pb.authStore.record?.id;

  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      if (!businessId) return [];
      return await pb.collection('stations').getFullList<TStation>({
        expand: "areaId",
        filter: `areaId.businessId = "${businessId}"`,
      });
    }
  });
};