import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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
import { Spinner } from "../spinner";
import { Separator } from "../separator";
import { MergeGroupSelect } from "../merge-group-select";
import { useListAreas } from "@/hooks/area/use-list-areas";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { useDeleteMergeGroup } from "@/hooks/merge-groups/use-delete-merge-group";
import { useCreateMergeGroup } from "@/hooks/merge-groups/use-create-merge-group";
import type { TMergeGroup } from "@/lib/types/mergeGroup";
import { useEditMergeGroup } from "@/hooks/merge-groups/use-edit-merge-group";

interface ManageStationDialogProps {
  mode: 'EDIT' | 'ADD';
  editData?: TMergeGroup,
  children: ReactNode;
}

export function ManageMergeGroupDialog({ mode, editData, children }: ManageStationDialogProps) {
  const [areaId, setAreaId] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [capacity, setCapacity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeletion, setConfirmingDeletion] = useState(false);

  const { data: areas } = useListAreas();
  const editMergeGroupMutation = useEditMergeGroup();
  const deleteMergeGroupMutation = useDeleteMergeGroup();
  const createMergeGroupMutation = useCreateMergeGroup();
  const isPending = editMergeGroupMutation.isPending || deleteMergeGroupMutation.isPending || createMergeGroupMutation.isPending;

  useEffect(() => {
    if (mode == "EDIT") {
      if (!editData) return;
      setAreaId(editData.areaId);
      setMembers(editData.members.map(m => m.id));
      setCapacity(editData.capacity);
    }
  }, [dialogOpen])

  const createMergeGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!areaId || !members) return;
    createMergeGroupMutation.mutate(
      { areaId, capacity, members },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setMembers([]);
          setCapacity(1);
          setAreaId("");
        }
      }
    );
  };

  const editMergeGroup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;
    const mergeGroupId = editData.id;
    if (!areaId || !members || !mergeGroupId) return;
    editMergeGroupMutation.mutate(
      { id: mergeGroupId, areaId, capacity, members },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  const deleteMergeGroup = () => {
    const mergeGroupId = editData?.id;
    if (!mergeGroupId) return;
    deleteMergeGroupMutation.mutate(mergeGroupId, {
      onSuccess: () => {
        setDialogOpen(false);
        setConfirmingDeletion(false);
      }
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          {mode === "ADD" ? (
            <>
              <DialogTitle>Add a new mergable Station Group</DialogTitle>
              <DialogDescription>
                TODO
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Edit Station Group</DialogTitle>
              <DialogDescription>
                Edit the details of this station group, including its members and which area it belongs to.
              </DialogDescription>
            </>
          )}

        </DialogHeader>
        <form onSubmit={mode === "ADD" ? createMergeGroup : editMergeGroup} className="space-y-4">
          {/* Area Select */}
          <div className="flex justify-between items-center">
            <Label>In which area is this group?</Label>
            <Select value={areaId} onValueChange={setAreaId}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select area..." />
              </SelectTrigger>
              <SelectContent>
                {areas?.map((area, i) => {
                  return <SelectItem value={area.id} key={i}>{area.name}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Mergable with Select */}
          <div className="flex justify-between items-center">
            <Label>Group Members</Label>
            <MergeGroupSelect members={members} setMembers={setMembers} areaId={areaId} />
          </div>

          {/* Capacity */}
          <div className="flex justify-between items-center">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              required
              className="w-[250px] self-end"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : mode === "ADD" ? <PlusIcon /> : <PencilIcon />}
              {mode === "ADD" ? "Add Station Group" : "Save Changes"}
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
              <DialogTitle>Delete Station Group</DialogTitle>
              <DialogDescription>
                Deleting this Station Group will permanently remove it.
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
                    <Button onClick={deleteMergeGroup} variant="destructive" type="button">
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
                    Delete Station Group
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
