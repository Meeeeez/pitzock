import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TReservationWithClientTimesInMinFromMidnight } from "@/lib/types/reservation";
import { PawPrintIcon, PencilLineIcon, UsersIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface ReservationSpanProps {
  reservation: TReservationWithClientTimesInMinFromMidnight;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export function ReservationSpan({ reservation, className }: ReservationSpanProps) {
  return (
    <div className={`flex justify-between h-9 rounded px-2 py-1 text-white cursor-pointer hover:opacity-90 transition-opacity bg-emerald-500 overflow-hidden ${className}`}>
      <div className="truncate text-xs font-medium">{reservation.client.name}</div>
      <div className="flex items-start justify-start gap-1.5">
        {reservation.notes && (
          <Tooltip>
            <TooltipTrigger asChild>
              <PencilLineIcon className="h-3 w-3 mt-0.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Client left a note: </p>
              <br />
              {reservation.notes}
            </TooltipContent>
          </Tooltip>
        )}
        {reservation.bringsPets && (
          <Tooltip>
            <TooltipTrigger asChild>
              <PawPrintIcon className="h-3 w-3 mt-0.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Client brings Pets</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-0.5">
              <UsersIcon className="h-3 w-3 mt-0.5" />
              <div className="text-xs font-semibold">{reservation.pax}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reservation.pax} People coming</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
