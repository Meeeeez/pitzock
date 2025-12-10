import pb from '@/lib/pocketbase';
import type { TClosedPeriod } from '@/lib/types/closed-period';
import { useQuery } from '@tanstack/react-query';

export function useListClosedPeriods() {
  return useQuery({
    queryKey: ['closedPeriods'],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb
        .collection('closedPeriods')
        .getFullList<TClosedPeriod>({ filter: `businessId = "${businessId}"` });
    }
  });
};