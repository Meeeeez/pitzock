import { LayoutGrid } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { TStation } from "@/lib/types/station";
import type { TWalkInWithSeatedAt } from "@/lib/types/walk-in";
import { AvailableStationSelect } from "../../available-stations-select";
import { useEditStationWalkInAssignment } from "@/hooks/walk-in/use-edit-station-walk-in-assignment";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../dialog";

interface EditWalkInDialogProps {
  children: ReactNode;
  station: TStation;
  walkIn: TWalkInWithSeatedAt;
}

export function EditWalkInDialog({ walkIn, station, children }: EditWalkInDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const editStationWalkInMutation = useEditStationWalkInAssignment();

  const saveNewStationAssignment = (newVal: string) => {
    // if value is of type gid:xxx it is a merge group.
    if (newVal.includes(":")) {
      editStationWalkInMutation.mutate(
        { walkInId: walkIn.id, mergeGroupId: newVal.split(":")[1] },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      editStationWalkInMutation.mutate(
        { walkInId: walkIn.id, stationId: newVal },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Walk-In</DialogTitle>
          <DialogDescription>
            You can change the station assignment for this Walk-In here.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pb-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" /> Station Assignment
          </p>
          <AvailableStationSelect
            pax={1}
            bringsPets={false}
            startsAt={walkIn.startsAt}
            endsAt={walkIn.endsAt}
            enabled={dialogOpen}
            defaultValue={'members' in walkIn.seatedAt ? "gId:" + walkIn.seatedAt.id : station.id}
            onValueChange={saveNewStationAssignment}
            currentStation={walkIn.seatedAt}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
