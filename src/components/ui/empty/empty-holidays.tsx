import { DoorClosedLockedIcon, PlusIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";
import { Button } from "../button";
import { ManageHolidaysDialog } from "../dialogs/manage-holidays-dialog";

export function EmptyHolidays() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DoorClosedLockedIcon />
        </EmptyMedia>
        <EmptyTitle>No Holidays</EmptyTitle>
        <EmptyDescription>
          Add your holidays here.
          Clients cannot book in the time when your business is on holiday.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ManageHolidaysDialog mode="ADD">
          <Button variant="outline" size="sm">
            <PlusIcon />
            Add Holidays
          </Button>
        </ManageHolidaysDialog>
      </EmptyContent>
    </Empty>
  )
}
