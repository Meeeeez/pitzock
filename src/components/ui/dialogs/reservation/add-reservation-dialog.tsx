import { CalendarPlusIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../dialog";
import { Label } from "../../label";
import { Input } from "../../input";
import { Textarea } from "../../textarea";
import { useState } from "react";
import { Calendar } from "../../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Switch } from "../../switch";
import { toast } from "sonner";
import pb from "@/lib/pocketbase";
import { useCreateClient } from "@/hooks/client/use-create-client";
import { useCreateReservation } from "@/hooks/reservation/use-create-reservation";
import { useQueryClient } from "@tanstack/react-query";
import type { TClient } from "@/lib/types/client";
import { ClientResponseError } from "pocketbase";
import { TimeSelect } from "../../time-select";
import { useGetBusiness } from "@/hooks/business/use-get-business";

export function AddReservationDialog() {
  const queryClient = useQueryClient();
  const createClientMutation = useCreateClient();
  const createReservationMutation = useCreateReservation();
  const { data: business } = useGetBusiness();
  const [dialogOpen, setDialogOpen] = useState<boolean>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [bringsPets, setBringsPets] = useState(false);
  const [numberOfClients, setNumberOfClients] = useState(0);
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(undefined);
  const [startDateTimeSelectOpen, setStartDateTimeSelectOpen] = useState(false);
  const [endDateTime, setEndDateTime] = useState<Date | undefined>(undefined);
  const [endDateTimeSelectOpen, setEndDateTimeSelectOpen] = useState(false);

  const getClientByEmail = async (email: string) => {
    return queryClient.fetchQuery({
      queryKey: ["clients", email],
      queryFn: async () => {
        const businessId = pb.authStore.record?.id;
        if (!businessId) throw new Error("Unauthorized");
        try {
          return await pb
            .collection("clients")
            .getFirstListItem<TClient>(`businessId="${businessId}" && email="${email}"`);
        } catch (err) {
          // ignore if its just the not found error from the query
          if (err instanceof ClientResponseError && err.status === 404) return null;
          else throw err;
        }
      },
    });
  }

  const createReservation = async () => {
    if (!name || !email || !numberOfClients || !startDateTime || !endDateTime) {
      toast.warning("Please fill out all required fields!");
      return;
    }
    if (!(/^\S+@\S+\.\S+$/.test(email))) toast.warning("This email is invalid!");

    const existingClient = await getClientByEmail(email);
    if (existingClient) {
      createReservationMutation.mutate(
        { clientId: existingClient.id, bringsPets, startsAt: startDateTime, endsAt: endDateTime, notes, pax: numberOfClients, status: "BOOKED" },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      const newClient = await createClientMutation.mutateAsync({ name, email });
      createReservationMutation.mutate(
        { clientId: newClient.id, bringsPets, startsAt: startDateTime, endsAt: endDateTime, notes, pax: numberOfClients, status: "BOOKED" },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarPlusIcon />
          New Reservation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Reservation</DialogTitle>
          <DialogDescription>
            Use this form to enter a guest’s reservation details, including their name, party size, date and time, special notes, and whether they will be bringing pets.
          </DialogDescription>

          <div className="space-y-4">
            {/* Name */}
            <div className="flex justify-between items-center">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mario Rossi"
                className="max-w-[300px]"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Email */}
            <div className="flex justify-between items-center">
              <Label htmlFor="name">Email</Label>
              <Input
                id="email"
                placeholder="mail@example.com"
                type="email"
                className="max-w-[300px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Pax */}
            <div className="flex justify-between items-center">
              <Label htmlFor="pax">Number of Clients</Label>
              <Input
                id="pax"
                name="pax"
                type="number"
                min={1}
                placeholder="Number of Clients"
                className="max-w-[300px]"
                value={numberOfClients}
                onChange={(e) => setNumberOfClients(parseInt(e.target.value))}
              />
            </div>

            {/* Start Date & Time */}
            <div className="flex justify-between items-center">
              <Label htmlFor="datetime">Start Date & Time</Label>
              <div className="flex gap-4 w-full max-w-[300px]">
                <div className="flex flex-col gap-3 w-full">
                  <Popover open={startDateTimeSelectOpen} onOpenChange={setStartDateTimeSelectOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-full justify-between font-normal"
                      >
                        {startDateTime ? startDateTime.toLocaleDateString("de-DE") : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDateTime}
                        captionLayout="dropdown"
                        weekStartsOn={1}
                        onSelect={(date) => {
                          if (!date) return;
                          const currentTime = startDateTime ? startDateTime : new Date();
                          const updatedDateTime = new Date(date);
                          updatedDateTime.setHours(currentTime.getHours());
                          updatedDateTime.setMinutes(currentTime.getMinutes());
                          updatedDateTime.setSeconds(currentTime.getSeconds());
                          setStartDateTime(date)
                          setStartDateTimeSelectOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <TimeSelect
                  step={business?.timeSlotSizeMin}
                  after={startDateTime}
                  openingHours={business?.openingHours[startDateTime?.getDay() ?? 0]}
                  onSelect={(value) => {
                    if (!startDateTime) return;
                    const [hours, minutes] = value.split(":").map(Number);
                    const updatedDateTime = new Date(startDateTime);
                    updatedDateTime.setHours(hours, minutes, 0, 0);
                    setStartDateTime(updatedDateTime);
                  }}
                />
              </div>
            </div>

            {/* End Date & Time */}
            <div className="flex justify-between items-center">
              <Label htmlFor="datetime">End Date & Time</Label>
              <div className="flex gap-4 w-full max-w-[300px]">
                <div className="flex flex-col gap-3 w-full">
                  <Popover open={endDateTimeSelectOpen} onOpenChange={setEndDateTimeSelectOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-full justify-between font-normal"
                      >
                        {endDateTime ? endDateTime.toLocaleDateString("de-DE") : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDateTime}
                        captionLayout="dropdown"
                        weekStartsOn={1}
                        onSelect={(date) => {
                          if (!date) return;
                          const currentTime = endDateTime ? endDateTime : new Date();
                          const updatedDateTime = new Date(date);
                          updatedDateTime.setHours(currentTime.getHours());
                          updatedDateTime.setMinutes(currentTime.getMinutes());
                          updatedDateTime.setSeconds(currentTime.getSeconds());
                          setEndDateTime(date)
                          setEndDateTimeSelectOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <TimeSelect
                  step={business?.timeSlotSizeMin}
                  after={startDateTime}
                  openingHours={business?.openingHours[endDateTime?.getDay() ?? 0]}
                  defaultValue={endDateTime ? endDateTime.toTimeString().slice(0, 5) : ""}
                  onSelect={(value) => {
                    const [h, m] = value.split(":").map(Number);
                    const updated = new Date(endDateTime || new Date());
                    updated.setHours(h, m, 0, 0);
                    setEndDateTime(updated);
                  }}
                />
              </div>
            </div>

            {/* Brings Pets */}
            <div className="flex justify-between items-center">
              <Label htmlFor="petsAllowed">Does this guest bring pets?</Label>
              <div className="flex items-center gap-2">
                No <Switch id="petsAllowed" checked={bringsPets} onCheckedChange={setBringsPets} /> Yes
              </div>
            </div>

            {/* Notes */}
            <div className="flex justify-between items-start">
              <Label htmlFor="notes">Reservation Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes..."
                className="max-w-[300px]"
                autoComplete="off"
                value={notes}
                onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="space-y-2">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>

              <Button onClick={createReservation} className="w-full">
                Create Reservation
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog >
  )
}
