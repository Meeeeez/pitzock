import type { TReservationWithClientAndSeatedAt } from "@/lib/types/reservation"
import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../dialog";
import { Clock, Users, Mail, MessageSquare, PawPrintIcon, LayoutGrid } from "lucide-react";
import type { TStation } from "@/lib/types/station";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../select"; // Assuming Shadcn Select
import { useListFittingStations } from "@/hooks/station/use-list-fitting-stations";
import { Spinner } from "../../spinner";
import { useEditStationReservationAssignment } from "@/hooks/reservation/use-edit-station-reservation-assignment";

interface EditReservationDialogProps {
  children: ReactNode;
  station: TStation;
  reservation: TReservationWithClientAndSeatedAt;
}

export function EditReservationDialog({ reservation, children, station }: EditReservationDialogProps) {
  const client = reservation.client;
  const resStart = new Date(reservation.startsAt)
  const resEnd = new Date(reservation.endsAt)
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: fittingOptions, isPending } = useListFittingStations(reservation, dialogOpen);
  const [singles, merges] = fittingOptions ?? [[], []];
  const editStationReservationMutation = useEditStationReservationAssignment();

  const dateToTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const saveNewStationAssignment = (newVal: string) => {
    // if value is of type gid:xxx it is a merge group.
    if (newVal.includes(":")) {
      editStationReservationMutation.mutate(
        { reservationId: reservation.id, mergeGroupId: newVal.split(":")[1] },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      editStationReservationMutation.mutate(
        { reservationId: reservation.id, stationId: newVal },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {client?.name || "Walk-in"}
            {client?.email && (
              <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-2 mt-0.5 font-normal w-fit">
                <Mail className="h-3 w-3" /> {client.email}
              </a>
            )}
          </DialogTitle>
          <DialogDescription />
          <div className="grid grid-cols-3 gap-3 text-foreground">
            <div className="flex flex-col gap-1 p-3 rounded-lg border bg-slate-50/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Time
              </span>
              <div className="font-semibold text-base">
                {dateToTime(resStart)} - {dateToTime(resEnd)}
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-lg border bg-slate-50/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Guests
              </span>
              <span className="font-semibold text-base">
                {reservation.pax}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-lg border bg-slate-50/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <PawPrintIcon className="h-3 w-3" /> Pets
              </span>
              <span className={`font-semibold text-base`}>
                {reservation.bringsPets ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {reservation.notes && (
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900 font-semibold">
                <span className="text-xs flex items-center gap-1 text-amber-900/60">
                  <MessageSquare className="h-3 w-3" /> Notes
                </span>
                {reservation.notes}
              </div>
            </div>
          )}
          <div className="space-y-3 pb-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Station Assignment
            </p>
            {isPending ? (
              <div className="flex justify-center w-full">
                <Spinner />
              </div>
            ) : (
              <Select defaultValue={'members' in reservation.seatedAt ? "gId:" + reservation.seatedAt.id : station.id} onValueChange={saveNewStationAssignment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* Always display current - either a single station or a group */}
                    {('members' in reservation.seatedAt) ? (
                      <SelectItem value={"gId:" + reservation.seatedAt.id}>
                        <div className="flex gap-2">
                          <span>{reservation.seatedAt.members.map(m => m.name).join(' & ')}</span>
                          <span className="text-muted-foreground">(Pax: {reservation.seatedAt.capacity})</span>
                        </div>
                      </SelectItem>
                    ) : (
                      <SelectItem value={station.id}>
                        {station.name} <span className="text-muted-foreground">(Current)</span>
                      </SelectItem>
                    )}
                    {singles.length === 0 && merges.length === 0 &&
                      <SelectLabel className="flex justify-center w-full uppercase text-muted-foreground tracking-wider">No other Stations fit this Reservation</SelectLabel>
                    }
                  </SelectGroup>

                  {/* Singles Section */}
                  {singles.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="uppercase text-muted-foreground tracking-wider">Individual Stations</SelectLabel>
                      {singles.map((opt, idx) => (
                        <SelectItem key={`s-${idx}`} value={opt.members[0].id}>
                          <div className="flex gap-2">
                            <span>{opt.members[0].name}</span>
                            <span className="text-muted-foreground">(Pax: {opt.capacity})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}

                  {/* Merges Section */}
                  {merges.length > 0 && singles.length === 0 && (
                    <SelectGroup>
                      <SelectLabel className="uppercase text-muted-foreground tracking-wider">Station Groups</SelectLabel>
                      {merges.map((opt, idx) => (
                        <SelectItem key={`m-${idx}`} value={"gId:" + opt.id}>
                          <div className="flex gap-2">
                            <span>{opt.members.map(m => m.name).join(' & ')}</span>
                            <span className="text-muted-foreground">(Pax: {opt.capacity})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog >
  )
}