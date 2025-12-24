import { LandPlot, PlusIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";
import { ManageMergeGroupDialog } from "../dialogs/manage-merge-group-dialog";
import { Button } from "../button";

export function EmptyStationGroups() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LandPlot />
        </EmptyMedia>
        <EmptyTitle>No Station Groups</EmptyTitle>
        <EmptyDescription>
          You can create a Station Group by clicking the Button below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ManageMergeGroupDialog mode="ADD">
          <Button variant="outline" size="sm">
            <PlusIcon />
            Add Station Group
          </Button>
        </ManageMergeGroupDialog>
      </EmptyContent>
    </Empty>
  )
}
