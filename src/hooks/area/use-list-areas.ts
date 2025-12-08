import pb from '@/lib/pocketbase';
import type { TArea } from '@/lib/types/area';
import { useQuery } from '@tanstack/react-query';

export function useListAreas() {
  return useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");
      return await pb
        .collection('areas')
        .getFullList<TArea>({ filter: `businessId = "${businessId}"` });
    }
  });
};