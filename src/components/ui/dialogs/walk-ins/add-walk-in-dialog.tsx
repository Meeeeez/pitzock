import { ChevronDownIcon, LogInIcon } from "lucide-react";
import { Button } from "../../button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../dialog";
import { Label } from "../../label";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Calendar } from "../../calendar";
import { TimeSelect } from "../../time-select";
import { useEffect, useState } from "react";
import { useGetBusiness } from "@/hooks/business/use-get-business";
import { AvailableStationSelect } from "../../available-stations-select";
import { useCreateWalkIn } from "@/hooks/walk-in/use-create-walk-in";

export function AddWalkInDialog() {
  const { data: business } = useGetBusiness();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [startDateTimeSelectOpen, setStartDateTimeSelectOpen] = useState(false);
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [endDateTimeSelectOpen, setEndDateTimeSelectOpen] = useState(false);
  const [stationAssignment, setStationAssignment] = useState("");
  const [enableCreateButton, setEnableCreateButton] = useState(false);
  const createWalkInMutation = useCreateWalkIn();

  useEffect(() => {
    const s = startDateTime;
    const e = endDateTime;
    const valid = (s.getHours() + s.getMinutes() > 0) && (e.getHours() + e.getMinutes() > 0) && (e > s) && !!stationAssignment;
    if (valid) setEnableCreateButton(true);
    else setEnableCreateButton(false);
  }, [endDateTime, startDateTime, stationAssignment]);

  const resetState = () => {
    setStationAssignment("");
    setStartDateTime(new Date());
    setEndDateTime(new Date());
    setEnableCreateButton(false);
    setDialogOpen(false);
  }

  const handleTimeChange = (value: string, type: 'start' | 'end') => {
    const [h, m] = value.split(":").map(Number);
    const updated = new Date(type === 'start' ? startDateTime : endDateTime);
    updated.setHours(h, m, 0, 0);

    if (type === 'start') setStartDateTime(updated);
    else setEndDateTime(updated);
  };

  const handleDateChange = (newDate: Date | undefined, type: 'start' | 'end') => {
    if (!newDate) return;

    const current = type === 'start' ? startDateTime : endDateTime;
    const updated = new Date(newDate);
    updated.setHours(current.getHours(), current.getMinutes(), current.getSeconds(), 0);

    if (type === 'start') {
      setStartDateTime(updated);
      setStartDateTimeSelectOpen(false);
    } else {
      setEndDateTime(updated);
      setEndDateTimeSelectOpen(false);
    }
  };

  const createWalkIn = () => {
    createWalkInMutation.mutate(
      { startsAt: startDateTime, endsAt: endDateTime, stationAssignment },
      { onSuccess: () => resetState() }
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(o) => {
      setDialogOpen(o);
      if (!o) resetState();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <LogInIcon />
          New Walk-In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Walk-In</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Start Time */}
          <div className="flex justify-between items-center">
            <Label htmlFor="datetime">Start Date & Time</Label>
            <div className="flex gap-4 w-full max-w-[300px]">
              <div className="flex flex-col gap-3 w-full">
                <Popover open={startDateTimeSelectOpen} onOpenChange={setStartDateTimeSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      disabled={true}
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
                      onSelect={(date) => handleDateChange(date, 'start')}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <TimeSelect
                step={business?.timeSlotSizeMin}
                after={startDateTime}
                openingHours={business?.openingHours[startDateTime?.getDay() ?? 0]}
                onSelect={(val) => handleTimeChange(val, 'start')}
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
                      onSelect={(date) => handleDateChange(date, 'end')}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <TimeSelect
                step={business?.timeSlotSizeMin}
                after={startDateTime}
                openingHours={business?.openingHours[endDateTime?.getDay() ?? 0]}
                onSelect={(val) => handleTimeChange(val, 'end')}
              />
            </div>
          </div>

          {/* List available Stations */}
          <div className="flex justify-between items-center">
            <Label>Assigned Station</Label>
            {/* least restrictive filters so that all free stations are shown */}
            <div className="w-full max-w-[300px]">
              <AvailableStationSelect
                pax={1}
                bringsPets={false}
                startsAt={startDateTime.toISOString()}
                endsAt={endDateTime.toISOString()}
                enabled={true}
                onValueChange={setStationAssignment}
              />
            </div>
          </div>

          <div className="space-y-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>

            <Button disabled={!enableCreateButton} onClick={createWalkIn} className="w-full">
              Create Walk-In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
