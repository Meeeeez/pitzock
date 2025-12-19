import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Spinner } from "./spinner";
import { EmptyStations } from "./empty/empty-stations";
import { useListMergeGroups } from "@/hooks/merge-groups/use-list-merge-groups";
import { Badge } from "./badge";
import { ManageMergeGroupDialog } from "./dialogs/manage-merge-group-dialog";
import { Button } from "./button";
import { PencilIcon } from "lucide-react";

export function MergeGroupsTable() {
  const { data: mergeGroups, isPending } = useListMergeGroups();


  if (isPending) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!mergeGroups || mergeGroups?.length === 0) {
    return <EmptyStations />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead className="text-center">Members</TableHead>
          <TableHead className="text-center">Capacity</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mergeGroups.map((mg, i) => {
          return (
            <TableRow key={mg.id}>
              <TableCell>{i}</TableCell>
              <TableCell className="text-center">
                {mg.members.map((mgm) => {
                  return <Badge key={mgm.id} >{mgm.name}</Badge>
                })}
              </TableCell>
              <TableCell className="text-center">{mg.capacity}</TableCell>
              <TableCell className="text-end">
                <ManageMergeGroupDialog mode='EDIT' editData={mg}>
                  <Button variant="outline" size="icon">
                    <PencilIcon />
                  </Button>
                </ManageMergeGroupDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table >
  )
}
