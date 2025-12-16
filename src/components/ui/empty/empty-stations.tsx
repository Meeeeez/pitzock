import { LandPlot, PlusIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";
import { Button } from "../button";
import { ManageStationDialog } from "../dialogs/manage-station-dialog";

export function EmptyStations() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LandPlot />
        </EmptyMedia>
        <EmptyTitle>No Stations</EmptyTitle>
        <EmptyDescription>
          A Station is everything that can be reserved in your business. For example a table or an employee.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ManageStationDialog mode="ADD">
          <Button variant="outline" size="sm">
            <PlusIcon />
            Add Station
          </Button>
        </ManageStationDialog>
      </EmptyContent>
    </Empty>
  )
}
