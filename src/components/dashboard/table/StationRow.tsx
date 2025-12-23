import { CircleXIcon } from "lucide-react";
import { type ComponentProps } from "react";
import type { TArea } from "@/lib/types/area";
import { ReservationSpan } from "./ReservationSpan";
import type { TStation } from "@/lib/types/station";
import type { TTimeSlot } from "@/lib/types/business";
import { TableRow, TableCell } from "@/components/ui/table";
import type { TReservationWithClientAndSeatedAt } from "@/lib/types/reservation";
import { ManageStationDialog } from "@/components/ui/dialogs/manage-station-dialog";
import { flattenOpeningHours, flattenReservations, SLOT_MINUTES } from "@/lib/time-slots";

interface StationRowProps {
  station: TStation;
  props?: ComponentProps<typeof TableCell>;
  reservations: TReservationWithClientAndSeatedAt[];
  areaOfStation: TArea;
  openingHours: TTimeSlot[];
}

export function StationRow({ station, reservations, areaOfStation, openingHours }: StationRowProps) {
  const ohTicksInMinFromMidnight = flattenOpeningHours(openingHours);
  const resTimesInMinFromMidnight = flattenReservations(reservations);
  let skipCount = 0;

  return (
    <TableRow className="border-l border-border">
      {/* Station Name Sticky Cell */}
      <ManageStationDialog mode="EDIT" editData={station}>
        <TableCell
          className={`sticky left-0 z-10 bg-accent hover:cursor-pointer hover:bg-neutral-200 ${(!station.isActive || !areaOfStation.isActive) && "bg-red-100 hover:bg-red-50"}`}
        >
          <div className="flex items-center gap-2">
            <span>{station.name} ({station.capacity})</span>
            {(!station.isActive) && <CircleXIcon className="w-3 h-3 mt-1" />}
          </div>
        </TableCell>
      </ManageStationDialog>

      {ohTicksInMinFromMidnight.map((tickMins) => {
        // If we are currently spanning a reservation, skip this iteration
        if (skipCount > 0) {
          skipCount--;
          return null;
        }

        // Find reservation starting at this exact time slot
        const resTimes = resTimesInMinFromMidnight?.find((r) => r.startMins === tickMins);
        const res = reservations.find((r) => r.id === resTimes?.id)
        const startMins = resTimes?.startMins;
        const endMins = resTimes?.endMins;
        if (startMins && endMins && res) {
          const duration = endMins - startMins;
          const colSpan = Math.round(duration / SLOT_MINUTES);
          // Important: We skip the NEXT (colSpan - 1) cells
          skipCount = colSpan - 1;
          return (
            <TableCell key={`${station.id}-${tickMins}`} colSpan={colSpan} className="p-0 border-none h-12">
              <ReservationSpan station={station} reservation={res} />
            </TableCell>
          );
        } else {
          // Empty Cell
          return (
            <TableCell
              key={`${station.id}-${tickMins}`}
              className="border-r border-muted/10 min-w-[45px] h-12"
            />
          );
        }
      })}
    </TableRow>
  );
}