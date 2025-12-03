import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../button";
import { PlusIcon } from "lucide-react";
import { Label } from "../label";
import { Input } from "../input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Spinner } from "../spinner";
import { Switch } from "../switch";
import { useCreateArea } from "@/hooks/use-create-area";

export function AddAreaDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [allowsPets, setAllowsPets] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const createAreaMutation = useCreateArea();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return;

    createAreaMutation.mutate(
      { name, allowsPets, isActive },
      { onSuccess: () => setDialogOpen(false) });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Add Area
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Area</DialogTitle>
          <DialogDescription>
            Areas are sections of your business that contain multiple stations.
            An area can represent a physical location, a department, or any other logical grouping of stations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Area 01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="max-w-[300px] self-end"
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
            <DialogClose asChild>
              <Button variant="outline" disabled={createAreaMutation.isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={createAreaMutation.isPending}>
              {createAreaMutation.isPending ? <Spinner /> : <PlusIcon />}
              Add Area
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
