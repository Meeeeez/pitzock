import { DoorClosedLockedIcon } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";

interface BusinessClosedProps {
  selectedDate: Date;
  type: "HOLIDAYS" | "OPENINGHOURS";
}

export function BusinessClosed({ selectedDate, type }: BusinessClosedProps) {
  const selectedDateString = selectedDate.toLocaleDateString("de-DE");
  return (
    <Empty className="flex w-full h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DoorClosedLockedIcon />
        </EmptyMedia>
        {type === "HOLIDAYS" && (
          <>
            <EmptyTitle>Business on holiday on {selectedDateString}</EmptyTitle>
            <EmptyDescription className="min-w-full">
              This business was marked as on holiday.
            </EmptyDescription>
          </>
        )}
        {type === "OPENINGHOURS" && (
          <>
            <EmptyTitle>Business is Closed on {selectedDateString}</EmptyTitle>
            <EmptyDescription className="min-w-full">
              This business is closed as per its opening hours.
            </EmptyDescription>
          </>
        )}
      </EmptyHeader>
    </Empty>
  )
}
