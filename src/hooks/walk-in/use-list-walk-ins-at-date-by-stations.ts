import pb from '@/lib/pocketbase';
import type { TStation } from '@/lib/types/station';
import type { TWalkIn, TWalkInWithSeatedAt } from '@/lib/types/walk-in';
import { useQuery } from '@tanstack/react-query';

export function useListWalkInsAtDateByStations(date: Date) {
  return useQuery({
    queryKey: ['walk-ins', date.toLocaleDateString()],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error("Unauthorized");

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const [stationWalkInRecords, allMergeLinks] = await Promise.all([
        pb.collection('stationWalkIns').getFullList({
          // Adjust this filter if your walkInId table has a businessId directly
          filter: `walkInId.startsAt >= "${start.toISOString()}" && walkInId.startsAt <= "${end.toISOString()}"`,
          expand: "walkInId, stationId",
          sort: "+walkInId.startsAt",
        }),
        pb.collection('mergeGroupStations').getFullList({
          expand: "mergeGroupId",
        })
      ]);

      // 2. Map Station -> MergeGroup for quick lookup
      const stationToGroupMap = new Map();
      allMergeLinks.forEach(link => {
        stationToGroupMap.set(link.stationId, link.expand?.mergeGroupId);
      });

      // 3. Aggregate by WalkIn ID
      const walkInAggregator = new Map<string, { walkIn: TWalkIn, stations: TStation[] }>();

      for (const record of stationWalkInRecords) {
        const walkInId = record.walkInId;
        const walkInData = record.expand?.walkInId;
        const station = record.expand?.stationId;

        if (!walkInData || !station) continue;

        if (!walkInAggregator.has(walkInId)) {
          walkInAggregator.set(walkInId, {
            walkIn: walkInData,
            stations: []
          });
        }
        walkInAggregator.get(walkInId)!.stations.push(station);
      }

      // 4. Transform into Station Map
      const stationsMap = new Map<string, TWalkInWithSeatedAt[]>();

      walkInAggregator.forEach(({ walkIn, stations }) => {
        const isMerged = stations.length > 1;
        const groupMeta = isMerged ? stationToGroupMap.get(stations[0].id) : null;

        const seatedAt = isMerged
          ? {
            id: groupMeta?.id || "temp-group",
            capacity: groupMeta?.capacity || 0,
            areaId: groupMeta?.areaId || "",
            members: stations.map(s => ({ id: s.id, name: s.name }))
          }
          : stations[0];

        const finalWalkIn = {
          ...walkIn,
          seatedAt,
        };

        stations.forEach(s => {
          const list = stationsMap.get(s.id) || [];
          list.push(finalWalkIn);
          stationsMap.set(s.id, list);
        });
      });

      return stationsMap;
    },
    staleTime: 1000 * 60 * 5
  });
}