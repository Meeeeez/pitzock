import { PlusIcon } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { ManageStationDialog } from "./dialogs/manage-station-dialog";
import { StationTable } from "./station-table";
import { ManageMergeGroupDialog } from "./dialogs/manage-merge-group-dialog";
import { MergeGroupsTable } from "./merge-groups-table";

export function StationEditor() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Manage Stations</CardTitle>
          <CardDescription>Add and edit stations</CardDescription>
        </div>
        <ManageStationDialog mode={"ADD"}>
          <Button variant="outline">
            <PlusIcon />
            Add Station
          </Button>
        </ManageStationDialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <StationTable />
      </CardContent>

      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Manage Station Groups</CardTitle>
          <CardDescription>
            In some cases stations can be merged to increase their capacity.
            For example, in a restaurant, tables can be combined to seat larger groups.
            If you have stations that can be merged, you can create and manage merge groups here.
          </CardDescription>
        </div>

        <ManageMergeGroupDialog mode={"ADD"}>
          <Button variant="outline">
            <PlusIcon />
            Add Station Group
          </Button>
        </ManageMergeGroupDialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <MergeGroupsTable />
      </CardContent>
    </Card>
  )
}
