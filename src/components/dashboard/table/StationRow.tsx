import { TableRow, TableCell } from "@/components/ui/table";
import { ReservationSpan } from "./ReservationSpan";
import { useState, type ComponentProps } from "react";
import { AddEditDeleteStationDialog } from "@/components/ui/dialogs/add-edit-delete-station-dialog";
import type { TStation } from "@/lib/types/station";
import type { TArea } from "@/lib/types/area";
import { CircleXIcon } from "lucide-react";

interface StationRowProps {
  station: TStation;
  areaOfStation: TArea;
  props?: ComponentProps<typeof TableCell>;
}

export function StationRow({ station, areaOfStation, props }: StationRowProps) {
  const [editStationDialogOpen, setEditStationDialogOpen] = useState(false);

  return (
    <>
      <AddEditDeleteStationDialog mode="EDIT" editData={station} dialogOpen={editStationDialogOpen} setDialogOpen={setEditStationDialogOpen} />
      <TableRow className={`${props?.className}`}>
        <TableCell
          onClick={() => setEditStationDialogOpen(prev => !prev)}
          className={`sticky left-0 z-10 bg-accent hover:cursor-pointer hover:bg-accent/50 ${(!station.isActive || !areaOfStation.isActive) && "bg-red-100 hover:bg-red-50"}`}
        >
          <div className="flex items-center gap-2">
            <span>{station.name} ({station.capacity})</span>
            {(!station.isActive) && <CircleXIcon className="w-3 h-3 mt-1" />}
          </div>
        </TableCell>
        <TableCell colSpan={4} className="px-0">
          <ReservationSpan name="Alice Johnson" pax={2} />
        </TableCell>
      </TableRow>
    </>
  )
}
