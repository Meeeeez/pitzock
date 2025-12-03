import { useState } from "react";
import { AddEditDeleteAreaDialog } from "../ui/dialogs/add-edit-delete-area-dialog";
import { AddEditDeleteStationDialog } from "../ui/dialogs/add-edit-delete-station-dialog";
import { TabsList, TabsTrigger } from "../ui/tabs";

export function DashboardHeader() {
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [stationDialogOpen, setStationDialogOpen] = useState(false);

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
        <AddEditDeleteStationDialog withTrigger mode="ADD" dialogOpen={stationDialogOpen} setDialogOpen={setStationDialogOpen} />
        <AddEditDeleteAreaDialog withTrigger mode="ADD" dialogOpen={areaDialogOpen} setDialogOpen={setAreaDialogOpen} />
      </div>
    </div>
  )
}