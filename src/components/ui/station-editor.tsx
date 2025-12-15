import { PlusIcon } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { ManageStationDialog } from "./dialogs/manage-station-dialog";
import { StationTable } from "./station-table";

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
    </Card>
  )
}
