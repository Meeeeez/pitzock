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
import { Switch } from "../switch";
import { Spinner } from "../spinner";
import { Separator } from "../separator";
import type { TStation } from "@/lib/types/station";
import { useListAreas } from "@/hooks/area/use-list-areas";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEditStation } from "@/hooks/station/use-edit-station";
import { useDeleteStation } from "@/hooks/station/use-delete-station";
import { useCreateStation } from "@/hooks/station/use-create-station";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

interface ManageStationDialogProps {
  mode: 'EDIT' | 'ADD';
  editData?: Omit<TStation, "created" | "updated">,
  children: ReactNode;
}

export function ManageStationDialog({ mode, editData, children }: ManageStationDialogProps) {
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeletion, setConfirmingDeletion] = useState(false);

  const { data: areas } = useListAreas();
  const editStationMutation = useEditStation();
  const deleteStationMutation = useDeleteStation();
  const createStationMutation = useCreateStation();
  const isPending = editStationMutation.isPending || deleteStationMutation.isPending || createStationMutation.isPending;

  useEffect(() => {
    if (mode == "EDIT") {
      if (!editData) return;
      setName(editData.name);
      setCapacity(editData.capacity);
      setIsActive(editData.isActive);
      setAreaId(editData.areaId);
    }
  }, [dialogOpen])

  const createStation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    createStationMutation.mutate(
      { name, areaId, capacity, isActive },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  const editStation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;
    const stationId = editData.id;
    if (!name.trim() || !stationId) return;
    editStationMutation.mutate(
      { id: stationId, areaId, name, capacity, isActive },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  const deleteStation = () => {
    const stationId = editData?.id;
    if (!stationId) return;
    deleteStationMutation.mutate(stationId, {
      onSuccess: () => {
        setDialogOpen(false)
        setConfirmingDeletion(false)
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
              <DialogTitle>Add a new Station</DialogTitle>
              <DialogDescription>
                Stations represent individual service points inside an area such as tables, rooms or workstations.
                Each station holds its own reservations and availability.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Edit Station</DialogTitle>
              <DialogDescription>
                Edit the details of this station, including its name, activity status, the capacity, and which area it belongs to.
              </DialogDescription>
            </>
          )}

        </DialogHeader>
        <form onSubmit={mode === "ADD" ? createStation : editStation} className="space-y-4">

          {/* Name */}
          <div className="flex justify-between items-center">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Station 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-[250px] self-end"
            />
          </div>

          {/* Capacity */}
          <div className="flex justify-between items-center">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="3"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              required
              className="w-[250px] self-end"
            />
          </div>

          {/* Area Select */}
          <div className="flex justify-between items-center">
            <Label>In which area is this station?</Label>
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

          {/* Is this station Active? */}
          <div className="flex justify-between items-center">
            <Label htmlFor="isActive">Is this station currently active?</Label>
            <div className="flex items-center gap-2">
              No <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} /> Yes
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : mode === "ADD" ? <PlusIcon /> : <PencilIcon />}
              {mode === "ADD" ? "Add Station" : "Save Changes"}
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
              <DialogTitle>Delete Station</DialogTitle>
              <DialogDescription>
                Deleting this station will permanently remove it.
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
                    <Button onClick={deleteStation} variant="destructive" type="button">
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
                    Delete Station
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
