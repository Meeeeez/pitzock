import pb from '@/lib/pocketbase';
import type { THoliday } from '@/lib/types/holiday';
import { useQuery } from '@tanstack/react-query';

export function useListHolidays() {
  return useQuery({
    queryKey: ['holidays'],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb
        .collection('holidays')
        .getFullList<THoliday>({ filter: `businessId = "${businessId}"` });
    }
  });
};