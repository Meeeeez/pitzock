import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../../button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../dialog";
import { Trash2Icon } from "lucide-react";
import { useDeleteWalkIn } from "@/hooks/walk-in/use-delete-walk-in";
import { useState } from "react";

interface DeleteWalkInDialogProps {
  walkInId: string
}

export function DeleteWalkInDialog({ walkInId }: DeleteWalkInDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const deleteWalkInMutation = useDeleteWalkIn();

  const deleteWalkIn = () => {
    deleteWalkInMutation.mutate(walkInId, {
      onSuccess: () => setDialogOpen(false)
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2 items-center text-destructive px-2 py-1.5 hover:bg-destructive/5 hover:cursor-default">
          <Trash2Icon className="mr-2 h-4 w-4" />
          <span className="text-sm">Delete</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this Walk-In.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={deleteWalkIn}>
            <Trash2Icon />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
