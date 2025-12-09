import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../label";
import { Input } from "../input";
import { Button } from "../button";
import { Switch } from "../switch";
import { Spinner } from "../spinner";
import { Separator } from "../separator";
import type { TArea } from "@/lib/types/area";
import { useEditArea } from "@/hooks/area/use-edit-area";
import { useCreateArea } from "@/hooks/area/use-create-area";
import { useDeleteArea } from "@/hooks/area/use-delete-area";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";


interface ManageAreaDialogProps {
  mode: 'EDIT' | 'ADD';
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  withTrigger?: boolean;
  editData?: Omit<TArea, "created" | "updated">,
}

export function ManageAreaDialog({ mode, withTrigger = false, dialogOpen, setDialogOpen, editData }: ManageAreaDialogProps) {
  const [name, setName] = useState("");
  const [allowsPets, setAllowsPets] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [confirmDeletion, setConfirmingDeletion] = useState(false);

  const editAreaMutation = useEditArea();
  const deleteAreaMutation = useDeleteArea();
  const createAreaMutation = useCreateArea();

  const isPending = createAreaMutation.isPending || editAreaMutation.isPending || deleteAreaMutation.isPending;

  useEffect(() => {
    if (mode == "EDIT") {
      if (!editData) return;
      setName(editData.name);
      setAllowsPets(editData.allowsPets);
      setIsActive(editData.isActive);
    }
  }, [])

  const createArea = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    createAreaMutation.mutate(
      { name, allowsPets, isActive },
      { onSuccess: () => setDialogOpen(false) });
  };

  const editArea = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const areaId = editData?.id;
    if (!name.trim() || !areaId) return;
    editAreaMutation.mutate(
      { id: areaId, name, allowsPets, isActive },
      { onSuccess: () => setDialogOpen(false) });
  };

  const deleteArea = () => {
    const areaId = editData?.id;
    if (!areaId) return;
    deleteAreaMutation.mutate(areaId);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {withTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusIcon />
            Add Area
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          {mode === "ADD" ? (
            <>
              <DialogTitle>Add a new Area</DialogTitle>
              <DialogDescription>
                Areas are sections of your business that contain multiple stations.
                An area can represent a physical location, a department, or any other logical grouping of stations.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Edit Area</DialogTitle>
              <DialogDescription>
                Edit the details of this area, including its name, activity status, and whether pets are allowed.
                Changes will update the area immediately in the system.
              </DialogDescription>
            </>
          )}

        </DialogHeader>
        <form onSubmit={mode === "ADD" ? createArea : editArea} className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Area 01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="max-w-[250px] self-end"
            />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="petsAllowed">Are pets allowed in this area?</Label>
            <div className="flex items-center gap-2">
              No <Switch id="petsAllowed" checked={allowsPets} onCheckedChange={setAllowsPets} /> Yes
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="isActive">Is this area currently active?</Label>
            <div className="flex items-center gap-2">
              No <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} /> Yes
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : mode === "ADD" ? <PlusIcon /> : <PencilIcon />}
              {mode === "ADD" ? "Add Area" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>

        {/*Delete Dialog */}
        {mode === "EDIT" && (
          <>
            <div className="relative flex items-center my-4">
              <div className="grow">
                <Separator />
              </div>
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <div className="grow">
                <Separator />
              </div>
            </div>

            <DialogHeader>
              <DialogTitle>Delete Area</DialogTitle>
              <DialogDescription>
                Deleting this area will permanently remove it and all of its stations.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex w-full justify-between!">
              {confirmDeletion ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-red-600 mr-2">
                    Are you sure? This cannot be undone.
                  </span>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => setConfirmingDeletion(false)}>
                      Cancel
                    </Button>
                    <Button onClick={deleteArea} variant="destructive" type="button">
                      <TrashIcon />
                      Yes, Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div></div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setConfirmingDeletion(true)}
                  >
                    <TrashIcon />
                    Delete Area and associated Stations
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}
