import pb from '@/lib/pocketbase';
import type { TArea } from '@/lib/types/area';
import { useQuery } from '@tanstack/react-query';

export function useAreas() {
  const businessId = pb.authStore.record?.id;

  return useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      if (!businessId) return [];
      return await pb.collection('areas').getFullList<TArea>({
        filter: `businessId = "${businessId}"`,
      });
    }
  });
};