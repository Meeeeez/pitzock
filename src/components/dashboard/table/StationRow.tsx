import { TableRow, TableCell } from "@/components/ui/table";
import { ReservationSpan } from "./ReservationSpan";
import { useState, type ComponentProps } from "react";
import { EditStationDialog } from "@/components/ui/dialogs/edit-station-dialog";

interface StationRowProps {
  props?: ComponentProps<typeof TableCell>;
}

export function StationRow({ props }: StationRowProps) {
  const [editStationDialogOpen, setEditStationDialogOpen] = useState(false);

  return (
    <>
      <EditStationDialog open={editStationDialogOpen} onOpenStateChange={setEditStationDialogOpen} />
      <TableRow className={props?.className}>
        <TableCell onClick={() => setEditStationDialogOpen(prev => !prev)} className="sticky left-0 z-10 bg-accent hover:cursor-pointer hover:bg-accent/50">1 (8)</TableCell>
        <TableCell colSpan={4} className="px-0">
          <ReservationSpan name="Alice Johnson" pax={2} />
        </TableCell>
      </TableRow>
    </>
  )
}
