import type { TMergeGroupWithMembers } from "./mergeGroup"
import type { TStation } from "./station"

export type TWalkIn = {
  id: string
  startsAt: string
  endsAt: string
  created: string
  updated: string
}

export type TWalkInWithSeatedAt = TWalkIn & {
  seatedAt: TStation | TMergeGroupWithMembers;
};