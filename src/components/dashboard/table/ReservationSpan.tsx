import { EditReservationDialog } from "@/components/ui/dialogs/reservation/edit-reservation-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TReservationWithClientAndSeatedAt } from "@/lib/types/reservation";
import type { TStation } from "@/lib/types/station";
import { PawPrintIcon, PencilLineIcon, UsersIcon, } from "lucide-react";
import type { HTMLAttributes } from "react";

interface ReservationSpanProps {
  station: TStation;
  reservation: TReservationWithClientAndSeatedAt;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export function ReservationSpan({ reservation, station, className }: ReservationSpanProps) {
  return (
    <EditReservationDialog station={station} reservation={reservation}>
      <div className={`flex justify-between h-9 rounded px-2 py-1 text-white cursor-pointer hover:opacity-90 transition-opacity bg-emerald-500 overflow-hidden ${className}`}>
        <div className="truncate text-xs font-medium">{reservation.client.name}</div>
        <div className="flex items-start justify-start gap-1.5">
          {reservation.notes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <PencilLineIcon className="h-3 w-3 mt-0.5" />
              </TooltipTrigger>
              <TooltipContent>Client left a Note</TooltipContent>
            </Tooltip>
          )}
          {reservation.bringsPets && (
            <Tooltip>
              <TooltipTrigger asChild>
                <PawPrintIcon className="h-3 w-3 mt-0.5" />
              </TooltipTrigger>
              <TooltipContent>Client brings Pets</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-0.5">
                <UsersIcon className="h-3 w-3 mt-0.5" />
                <div className="text-xs font-semibold">{reservation.pax}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>{reservation.pax} People coming</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </EditReservationDialog>
  );
}