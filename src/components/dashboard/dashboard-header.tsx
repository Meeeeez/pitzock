import { useState } from "react";
import { ManageAreaDialog } from "../ui/dialogs/manage-area-dialog";
import { ManageStationDialog } from "../ui/dialogs/manage-station-dialog";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { AddReservationDialog } from "../ui/dialogs/add-reservation-dialog";

export function DashboardHeader() {
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [stationDialogOpen, setStationDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-muted-foreground">Show:</div>
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="manage-business">Manage Business</TabsTrigger>
        </TabsList>
      </div>
      <div className="flex items-center gap-2">
        <ManageStationDialog withTrigger mode="ADD" dialogOpen={stationDialogOpen} setDialogOpen={setStationDialogOpen} />
        <ManageAreaDialog withTrigger mode="ADD" dialogOpen={areaDialogOpen} setDialogOpen={setAreaDialogOpen} />
        <AddReservationDialog />
      </div>
    </div>
  )
}