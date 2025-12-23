import pb from '@/lib/pocketbase';
import type { TMergeGroupWithMembers } from '@/lib/types/mergeGroup';
import type { TReservationWithClientAndSeatedAt } from '@/lib/types/reservation';
import type { TStation } from '@/lib/types/station';
import { useQuery } from '@tanstack/react-query';

export function useListReservationsAtDateByStations(date: Date) {
  return useQuery({
    queryKey: ['reservations', date.toLocaleDateString()],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const filter = pb.filter(
        "reservationId.clientId.businessId = {:businessId} && " +
        "reservationId.startsAt >= {:startOfDay} && " +
        "reservationId.endsAt <= {:endOfDay}",
        { businessId, startOfDay, endOfDay }
      );

      const stationResRecords = await pb.collection('stationReservations').getFullList({
        filter: filter,
        expand: "reservationId.clientId, stationId",
        sort: "+reservationId.startsAt",
      });

      const allMergeLinks = await pb.collection('mergeGroupStations').getFullList({
        expand: "mergeGroupId, stationId",
      });

      // Create a helper map: StationID -> MergeGroupData
      const stationToGroupMap = new Map<string, any>();
      allMergeLinks.forEach(link => {
        stationToGroupMap.set(link.stationId, link.expand?.mergeGroupId);
      });

      // Aggregate by Reservation ID
      const resAggregator = new Map<string, {
        reservation: any,
        client: any,
        stations: TStation[],
        mergeGroupId: string | null
      }>();

      for (const record of stationResRecords) {
        const resId = record.reservationId;
        const reservation = record.expand?.reservationId;
        const client = reservation?.expand?.clientId;
        const station = record.expand?.stationId;

        if (!reservation || !client || !station) continue;

        if (!resAggregator.has(resId)) {
          // Check if this station belongs to a merge group
          const groupInfo = stationToGroupMap.get(record.stationId);

          resAggregator.set(resId, {
            reservation,
            client,
            stations: [],
            // only consider it a 'Merge' if the reservation occupies > 1 station
            mergeGroupId: groupInfo?.id || null
          });
        }
        resAggregator.get(resId)!.stations.push(station);
      }

      // final formatting
      const stationsMap = new Map<string, TReservationWithClientAndSeatedAt[]>();

      resAggregator.forEach((data) => {
        let seatedAt: TStation | TMergeGroupWithMembers;

        // Determination: If reservation has multiple stations, it's a MergeGroup
        if (data.stations.length > 1) {
          const groupMeta = stationToGroupMap.get(data.stations[0].id);

          seatedAt = {
            id: groupMeta?.id || "temp-group",
            capacity: groupMeta?.capacity || 0,
            areaId: groupMeta?.areaId || "",
            members: data.stations.map(s => ({ id: s.id, name: s.name }))
          };
        } else {
          seatedAt = data.stations[0];
        }

        const finalReservation: TReservationWithClientAndSeatedAt = {
          ...data.reservation,
          client: data.client,
          seatedAt
        };

        data.stations.forEach(s => {
          if (!stationsMap.has(s.id)) stationsMap.set(s.id, []);
          stationsMap.get(s.id)!.push(finalReservation);
        });
      });

      return stationsMap;
    },
  });
}