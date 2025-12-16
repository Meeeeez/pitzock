import { LandPlot, PlusIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";
import { Button } from "../button";
import ManageClosedPeriodDialog from "../dialogs/manage-closed-period-dialog";

export function EmptyBusinessClosurePeriod() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LandPlot />
        </EmptyMedia>
        <EmptyTitle>No Closed Periods</EmptyTitle>
        <EmptyDescription>
          If your business is closed for a period of time you can enter it here. Once you entered it, clients can no longer book in this timeslot.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ManageClosedPeriodDialog mode="ADD">
          <Button variant="outline" size="sm">
            <PlusIcon />
            Add Closed Period
          </Button>
        </ManageClosedPeriodDialog>
      </EmptyContent>
    </Empty>
  )
}
