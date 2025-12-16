import { DoorClosedLockedIcon } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";

interface BusinessClosedProps {
  selectedDate: Date;
  reason: string;
}

export function BusinessClosed({ selectedDate, reason }: BusinessClosedProps) {
  const selectedDateString = selectedDate.toLocaleDateString("de-DE");
  return (
    <Empty className="flex w-full h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DoorClosedLockedIcon />
        </EmptyMedia>
        <EmptyTitle>Business is Closed on {selectedDateString}</EmptyTitle>
        <EmptyDescription className="min-w-full">
          {reason}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
