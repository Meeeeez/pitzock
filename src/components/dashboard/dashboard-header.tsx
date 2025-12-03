import { useState } from "react";
import { AddEditAreaDialog } from "../ui/dialogs/add-edit-area-dialog";
import { AddStationDialog } from "../ui/dialogs/add-station-dialog";
import { TabsList, TabsTrigger } from "../ui/tabs";

export function DashboardHeader() {
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-muted-foreground">Show:</div>
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="a&s">Areas & Stations</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex items-center gap-2">
        <AddStationDialog />
        <AddEditAreaDialog withTrigger mode="ADD" dialogOpen={areaDialogOpen} setDialogOpen={setAreaDialogOpen} />
      </div>
    </div>
  )
}