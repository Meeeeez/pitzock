import { OctagonAlert } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";

export function BusinessInactive() {
  return (
    <Empty className="flex w-full h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <OctagonAlert />
        </EmptyMedia>
        <EmptyTitle>This Business was Deactivated</EmptyTitle>
        <EmptyDescription className="min-w-full">
          Clients can not create bookings while your business is deactivated.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
