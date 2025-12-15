import { useListStations } from "@/hooks/station/use-list-stations";
import { ManageStationDialog } from "./dialogs/manage-station-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Spinner } from "./spinner";
import { Button } from "./button";
import { PencilIcon } from "lucide-react";

export function StationTable() {
  const { data: stations, isPending } = useListStations();

  if (isPending) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!stations || stations?.length === 0) {
    return <p className='text-sm'>No Stations yet</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Capacity</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-end">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stations.map((s, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{s.name}</TableCell>
              <TableCell className="text-center">{s.capacity}</TableCell>
              <TableCell className="text-center">{s.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell className="text-end">
                <ManageStationDialog mode='EDIT' editData={s}>
                  <Button variant="outline" size="icon">
                    <PencilIcon />
                  </Button>
                </ManageStationDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
