import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { Button } from "../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Label } from "../label";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { useState } from "react";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Switch } from "../switch";

export function AddReservationDialog() {
  const [open, setOpen] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [bringsPets, setBringsPets] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New Reservation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Reservation</DialogTitle>
          <DialogDescription>
            Use this form to enter a guest’s reservation details, including their name, party size, date and time, special notes, and whether they will be bringing pets.
          </DialogDescription>

          <form className="space-y-4">
            {/* Name */}
            <div className="flex justify-between items-center">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mario Rossi"
                required
                className="max-w-[300px]"
                autoComplete="off" />
            </div>

            {/* Email */}
            <div className="flex justify-between items-center">
              <Label htmlFor="name">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="mail@example.com"
                type="email"
                required
                className="max-w-[300px]" />
            </div>

            {/* Pax */}
            <div className="flex justify-between items-center">
              <Label htmlFor="pax">Number of Guests</Label>
              <Input
                id="pax"
                name="pax"
                type="number"
                min={1}
                placeholder="Number of Guests"
                required
                className="max-w-[300px]"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
              />
            </div>

            {/* Date & Time */}
            <div className="flex justify-between items-center">
              <Label htmlFor="datetime">Date & Time</Label>
              <div className="flex gap-4 w-full max-w-[300px]">
                <div className="flex flex-col gap-3 w-full">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="w-full justify-between font-normal"
                      >
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date)
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Input
                  type="time"
                  id="time-picker"
                  step="1"
                  defaultValue="10:30"
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional notes..."
                className="max-w-[300px]"
                autoComplete="off" />
            </div>

            <div className="space-y-2">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" className="w-full">
                Create Reservation
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog >
  )
}
