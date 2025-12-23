import { useQuery } from '@tanstack/react-query';
import pb from '@/lib/pocketbase';
import type { TReservation } from '@/lib/types/reservation';
import type { TStation } from '@/lib/types/station';

export type TFittingOption = {
  id?: string; // only on type === 'merge'
  capacity: number;
  type: 'single' | 'merge';
  members: TStation[];
};

export function useListFittingStations(reservation: TReservation, enabled: boolean) {
  return useQuery({
    queryKey: ['stationsFittingReservation', reservation],
    queryFn: async (): Promise<TFittingOption[][]> => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");

      const params = {
        pax: reservation.pax,
        bringsPets: reservation.bringsPets,
        start: reservation.startsAt,
        end: reservation.endsAt,
        businessId
      };

      const [singles, merges] = await Promise.all([
        pb.send<TFittingOption[]>("/api/find-suitable-stations", params),
        pb.send<TFittingOption[]>("/api/find-suitable-merge-groups", params)
      ]);

      return [singles, merges];
    },
    enabled: enabled
  });
}