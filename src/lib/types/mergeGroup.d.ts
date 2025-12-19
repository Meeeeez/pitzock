export type TMergeGroup = {
  id: string
  areaId: string
  capacity: number
  members: TMergeGroupMember[]
  created: string
  updated: string
}

export type TMergeGroupMember = {
  id: string,
  name: string;
}

export type TMergeGroupDb = {
  id: string
  capacity: number
  areaId: string
}