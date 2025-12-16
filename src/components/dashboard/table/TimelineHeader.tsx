import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { expandOpeningHours, minutesToTime, SLOT_MINUTES } from "@/lib/time-slots";
import type { TTimeSlot } from "@/lib/types/business";
import { Fragment } from "react";

interface TimelineHeaderProps {
  openingHours: TTimeSlot[];
  stepMinutes?: number;
}

export function TimelineHeader({
  openingHours,
  stepMinutes = SLOT_MINUTES,
}: TimelineHeaderProps) {
  return (
    <TableHeader className="min-w-24 sticky top-0 z-10 bg-background">
      <TableRow>
        {/* Empty column for area/station labels */}
        <TableHead className="min-w-24 border-l border-border" />

        {openingHours.map((slot, index) => {
          const expanded = expandOpeningHours([slot], stepMinutes);

          return (
            <Fragment key={`${slot.start}-${slot.end}`}>
              {expanded.map(minutes => (
                <TableHead
                  key={minutes}
                  className="min-w-24 border-l border-border"
                >
                  {minutesToTime(minutes)}
                </TableHead>
              ))}

              {/* Separator BETWEEN slots */}
              {index < openingHours.length - 1 && (
                <TableHead className="min-w-32 max-w-32 bg-accent border-none p-0" />
              )}
            </Fragment>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
