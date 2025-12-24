import { useQuery } from '@tanstack/react-query';
import pb from '@/lib/pocketbase';
import type { TStation } from '@/lib/types/station';
import type { TMergeGroupWithMembers } from '@/lib/types/mergeGroup';

export type TFittingOption = {
  id?: string; // only on type === 'merge'
  capacity: number;
  type: 'single' | 'merge';
  members: TStation[];
};

export function useListFittingStations(
  pax: number,
  bringsPets: boolean,
  startsAt: string,
  endsAt: string,
  enabled: boolean | undefined = true,
  currentStation?: TStation | TMergeGroupWithMembers
) {
  return useQuery({
    queryKey: ['fittingStations', pax, bringsPets, startsAt, endsAt, currentStation],
    queryFn: async (): Promise<TFittingOption[][]> => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");

      let mergeGroupId, stationId;
      if (currentStation && ('members' in currentStation)) {
        mergeGroupId = currentStation.id;
      } else if (currentStation) {
        stationId = currentStation.id;
      }

      const params = {
        pax,
        bringsPets,
        start: startsAt,
        end: endsAt,
        businessId,
        ...(mergeGroupId && { mergeGroupId }),
        ...(stationId && { stationId }),
      };

      const [singles, merges] = await Promise.all([
        pb.send<TFittingOption[]>("/api/find-suitable-stations", params),
        pb.send<TFittingOption[]>("/api/find-suitable-merge-groups", params)
      ]);

      return [singles, merges];
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5
  });
}