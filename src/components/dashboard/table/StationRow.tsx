import { CircleXIcon } from "lucide-react";
import { type ComponentProps } from "react";
import type { TArea } from "@/lib/types/area";
import { ReservationSpan } from "./ReservationSpan";
import type { TStation } from "@/lib/types/station";
import type { TTimeSlot } from "@/lib/types/business";
import { TableRow, TableCell } from "@/components/ui/table";
import type { TReservationWithClientAndSeatedAt } from "@/lib/types/reservation";
import { ManageStationDialog } from "@/components/ui/dialogs/manage-station-dialog";
import { flattenOpeningHours, flattenBooking } from "@/lib/time-slots";
import { WalkInSpan } from "./WalkInSpan";
import type { TWalkInWithSeatedAt } from "@/lib/types/walk-in";

interface StationRowProps {
  station: TStation;
  reservations: TReservationWithClientAndSeatedAt[];
  walkIns: TWalkInWithSeatedAt[];
  areaOfStation: TArea;
  timeSlotSizeMin: number;
  openingHours: TTimeSlot[];
  props?: ComponentProps<typeof TableCell>;
}

export function StationRow({ station, timeSlotSizeMin, reservations, walkIns, areaOfStation, openingHours }: StationRowProps) {
  let skipCount = 0;
  const walkInTimes = flattenBooking(walkIns) || [];
  const resTimes = flattenBooking(reservations) || [];
  const ohTicksInMinFromMidnight = flattenOpeningHours(openingHours, timeSlotSizeMin);

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
        if (skipCount > 0) {
          skipCount--;
          return null;
        }

        // Check for Reservation
        const resMeta = resTimes.find((r) => r.startMins === tickMins);
        if (resMeta) {
          const resData = reservations.find((r) => r.id === resMeta.id);
          if (resData) {
            const colSpan = Math.round((resMeta.endMins - resMeta.startMins) / timeSlotSizeMin);
            skipCount = colSpan - 1;
            return (
              <TableCell key={`${station.id}-${tickMins}`} colSpan={colSpan} className="p-0 border-none h-12">
                <ReservationSpan station={station} reservation={resData} />
              </TableCell>
            );
          }
        }

        // Check for Walk-In
        const walkInMeta = walkInTimes.find((w) => w.startMins === tickMins);
        if (walkInMeta) {
          const walkInData = walkIns.find((w) => w.id === walkInMeta.id);
          if (walkInData) {
            const colSpan = Math.round((walkInMeta.endMins - walkInMeta.startMins) / timeSlotSizeMin);
            skipCount = colSpan - 1;
            return (
              <TableCell key={`${station.id}-${tickMins}`} colSpan={colSpan} className="p-0 border-none h-12">
                <WalkInSpan station={station} walkIn={walkInData} />
              </TableCell>
            );
          }
        }

        return (
          <TableCell
            key={`${station.id}-${tickMins}`}
            className="border-r border-muted/10 min-w-[45px] h-12"
          />
        );
      })}
    </TableRow>
  );
}