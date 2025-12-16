import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Spinner } from "./spinner";
import { Button } from "./button";
import { PencilIcon } from "lucide-react";
import { useListAreas } from "@/hooks/area/use-list-areas";
import { ManageAreaDialog } from "./dialogs/manage-area-dialog";
import { EmptyAreas } from "./empty/empty-areas";

export function AreaTable() {
  const { data: areas, isPending } = useListAreas();

  if (isPending) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!areas || areas?.length === 0) {
    return <EmptyAreas />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Allows Pets</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {areas.map((a, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{a.name}</TableCell>
              <TableCell className="text-center">{a.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell className="text-center">{a.allowsPets ? "Yes" : "No"}</TableCell>
              <TableCell className="text-end">
                <ManageAreaDialog mode='EDIT' editData={a}>
                  <Button variant="outline" size="icon">
                    <PencilIcon />
                  </Button>
                </ManageAreaDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
