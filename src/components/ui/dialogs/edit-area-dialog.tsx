import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../button";
import { PlusIcon } from "lucide-react";
import { Separator } from "../separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import type { Dispatch, SetStateAction } from "react";

interface EditAreaDialogProps {
  open?: boolean;
  onOpenStateChange?: Dispatch<SetStateAction<boolean>>;
}

export function EditAreaDialog({ open, onOpenStateChange }: EditAreaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenStateChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Area</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
