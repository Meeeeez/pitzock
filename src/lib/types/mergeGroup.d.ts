export type TMergeGroup = {
  id: string
  capacity: number
  areaId: string
}

export type TMergeGroupMember = {
  id: string,
  name: string;
}

export type TMergeGroupWithMembers = TMergeGroup & {
  members: TMergeGroupMember[]
}