import pb from '@/lib/pocketbase';
import type { TReservation } from '@/lib/types/reservation';
import { useQuery } from '@tanstack/react-query';

export function useListReservationsAtDateByStations(date: Date) {
  return useQuery({
    queryKey: ['reservationsByDate', date.toLocaleDateString()],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");

      // 1. Define the range for the entire day (Local Time)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // 2. Use pb.filter to safely inject dates
      const filter = pb.filter(
        "reservationId.clientId.businessId = {:businessId} && " +
        "reservationId.startsAt >= {:startOfDay} && " +
        "reservationId.endsAt <= {:endOfDay}",
        { businessId, startOfDay, endOfDay }
      );

      const reservationsAtDate = await pb.collection('stationReservations').getFullList({
        filter: filter,
        expand: "reservationId",
        sort: "+reservationId.startsAt",
      });

      // 3. Manually group them into a clean array of stations
      const stationsMap = new Map<string, TReservation[]>();
      for (const res of reservationsAtDate) {
        const reservation = res.expand?.reservationId;
        if (!reservation) continue;
        if (!stationsMap.has(res.stationId)) stationsMap.set(res.stationId, []);
        stationsMap.get(res.stationId)?.push(reservation);
      }

      return stationsMap;
    },
  });
}