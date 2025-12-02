import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";

interface EditStationDialogProps {
  open?: boolean;
  onOpenStateChange?: Dispatch<SetStateAction<boolean>>;
}

export function EditStationDialog({ open, onOpenStateChange }: EditStationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenStateChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Station</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
