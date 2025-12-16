import { Button } from "./button"
import { Spinner } from "./spinner";
import { Checkbox } from "./checkbox";
import { Separator } from "./separator";
import { TimeSelect } from "./time-select";
import { useEffect, useState } from "react";
import type { TOpeningHours } from "@/lib/types/business";
import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react"
import { useGetOpeningHours } from "@/hooks/business/use-get-opening-hours";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEditBusiness } from "@/hooks/business/use-edit-business";
import { toast } from "sonner";

export function OpeningHoursEditor() {
  const { data: prevOpeningHours, isPending: openingHoursPending } = useGetOpeningHours();
  const editBusinessMutation = useEditBusiness();
  const [openingHours, setOpeningHours] = useState(prevOpeningHours);
  const isPending = openingHoursPending || editBusinessMutation.isPending;
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    setOpeningHours(prevOpeningHours);
  }, [prevOpeningHours])

  const addTimeSlotToWeekday = (dayIndex: number) => {
    if (!openingHours) return;
    const oh: TOpeningHours = [...openingHours];
    oh[dayIndex].push({ start: "--:--", end: "--:--" });
    setOpeningHours(oh);
  }

  const removeTimeSlotFromWeekday = (dayIndex: number, timeSlotIndex: number) => {
    if (!openingHours) return;
    const oh: TOpeningHours = [...openingHours];
    oh[dayIndex].splice(timeSlotIndex, 1);
    setOpeningHours(oh);
  }

  const toggleWeekday = (dayIndex: number) => {
    if (!openingHours) return;
    const oh: TOpeningHours = [...openingHours];
    if (oh[dayIndex].length === 0) addTimeSlotToWeekday(dayIndex);
    else oh[dayIndex].length = 0;
    setOpeningHours(oh);
  }

  const onTimeSelected = (value: string, key: "start" | "end", dayIndex: number, timeSlotIndex: number) => {
    if (!openingHours) return;
    const oh: TOpeningHours = [...openingHours];
    oh[dayIndex][timeSlotIndex][key] = value;
    setOpeningHours(oh);
  }

  const saveOpeningHours = () => {
    editBusinessMutation.mutate(
      { openingHours },
      {
        onSuccess: () => toast.success("Opening hours updated successfully!"),
        onError: (e) => toast.error("Failed to update opening hours: " + e.message)
      })
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Opening Hours</CardTitle>
          <CardDescription>
            Set your business opening hours. You can add multiple time slots.
          </CardDescription>
        </div>
      </CardHeader>
      {isPending ? (
        <div className='w-full flex justify-center'>
          <Spinner />
        </div>
      ) : (
        <CardContent>
          <Separator />
          {openingHours?.map((slots, i) => {
            return (
              <div key={i}>
                <div className="flex justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={slots.length !== 0} onCheckedChange={() => toggleWeekday(i)} className="w-6 h-6" />
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{weekdays[i]}</div>
                      {slots.length === 0 && <div className="text-sm">(Closed)</div>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {slots.map((slot, j) => {
                      return (
                        <div key={j}>
                          <div className="flex items-center gap-3">
                            <TimeSelect step={30} defaultValue={slot.start} onSelect={(e) => onTimeSelected(e, "start", i, j)} />
                            —
                            <TimeSelect step={30} defaultValue={slot.end} onSelect={(e) => onTimeSelected(e, "end", i, j)} />
                            <Button variant="ghost" size="icon" onClick={() => removeTimeSlotFromWeekday(i, j)}>
                              <Trash2Icon className="text-destructive" />
                            </Button>
                          </div>
                          {(j === slots.length - 1) && (
                            <Button className="mt-2" variant={"ghost"} onClick={() => addTimeSlotToWeekday(i)}>
                              <PlusIcon />
                              Add Time Slot
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                {(openingHours.length - 1 !== i) && <Separator />}
              </div>
            )
          })}
          <Button onClick={saveOpeningHours} className="w-full">
            <SaveIcon />
            Save Opening Hours
          </Button>
        </CardContent>
      )
      }
    </Card >
  )
}
