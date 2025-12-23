import pb from '@/lib/pocketbase';
import type { TBusiness } from '@/lib/types/business';
import { useQuery } from '@tanstack/react-query';

export function useGetBusiness() {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return (await pb.collection('businesses').getOne<TBusiness>(businessId));
    },
    staleTime: 1000 * 60 * 5
  });
};