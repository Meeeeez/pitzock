import pb from '@/lib/pocketbase';
import type { TMergeGroupWithMembers } from '@/lib/types/mergeGroup';
import { useQuery } from '@tanstack/react-query';

export function useListMergeGroups() {
  return useQuery({
    queryKey: ['mergeGroups'],
    queryFn: async () => {
      const businessId = pb.authStore.record?.id;
      if (!businessId) throw new Error('Unauthorized');

      const res = await pb
        .collection('mergeGroupStations')
        .getFullList({
          filter: `stationId.areaId.businessId = "${businessId}"`,
          expand: 'mergeGroupId,stationId',
        });

      const groupsMap = new Map<string, any>();

      for (const row of res) {
        const group = row.expand?.mergeGroupId;
        const station = row.expand?.stationId;
        if (!group || !station) continue;

        if (!groupsMap.has(group.id)) {
          groupsMap.set(group.id, {
            id: group.id,
            capacity: group.capacity,
            areaId: group.areaId,
            created: group.created,
            updated: group.updated,
            members: [],
          });
        }

        groupsMap.get(group.id).members.push({ id: row.stationId, name: station.name });
      }

      return Array.from(groupsMap.values()) as TMergeGroupWithMembers[];
    },
  });
}
