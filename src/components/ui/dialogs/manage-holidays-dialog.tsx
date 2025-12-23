import { Button } from "../button";
import { ChevronDownIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Label } from "../label";
import { Spinner } from "../spinner";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";
import { Separator } from "../separator";
import { useCreateHolidays } from "@/hooks/holidays/use-create-holidays";
import { useEditHolidays } from "@/hooks/holidays/use-edit-holidays";
import { useDeleteHolidays } from "@/hooks/holidays/use-delete-holidays";
import type { THoliday } from "@/lib/types/holiday";
import { TimeSelect } from "../time-select";
import { useGetBusiness } from "@/hooks/business/use-get-business";

interface ManageHolidaysDialogProps {
  mode: "ADD" | "EDIT" | "DELETE";
  editData?: Omit<THoliday, "created" | "updated">,
  children: ReactNode;
}

export function ManageHolidaysDialog({ mode, editData, children }: ManageHolidaysDialogProps) {
  const [confirmDeletion, setConfirmingDeletion] = useState(false);
  const [fromDateTime, setFromDateTime] = useState<Date | undefined>(undefined);
  const [fromDateTimeSelectOpen, setFromDateTimeSelectOpen] = useState(false);
  const [toDateTime, setToDateTime] = useState<Date | undefined>(undefined);
  const [toDateTimeSelectOpen, setToDateTimeSelectOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: business } = useGetBusiness();
  const createHolidaysMutation = useCreateHolidays();
  const editHolidaysMutation = useEditHolidays();
  const deleteHolidaysMutation = useDeleteHolidays();

  const isPending = createHolidaysMutation.isPending || editHolidaysMutation.isPending || deleteHolidaysMutation.isPending;

  useEffect(() => {
    if (mode == "EDIT") {
      if (!editData) return;
      setFromDateTime(new Date(editData.from));
      setToDateTime(new Date(editData.to))
    }
  }, [dialogOpen])

  const createHolidays = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fromDateTime || !toDateTime) return;
    createHolidaysMutation.mutate(
      { from: fromDateTime, to: toDateTime },
      { onSuccess: () => setDialogOpen(false) }
    );
  }

  const editHolidays = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fromDateTime || !toDateTime || !editData) return;
    editHolidaysMutation.mutate(
      { id: editData.id, from: fromDateTime, to: toDateTime },
      { onSuccess: () => setDialogOpen(false) }
    );
  }

  const deleteHolidays = () => {
    const holidayId = editData?.id;
    if (!holidayId) return;
    deleteHolidaysMutation.mutate(holidayId, {
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
              <DialogTitle>Add a new Holiday</DialogTitle>
              <DialogDescription>
                Add a new holiday by entering a start date and time and an end date and time.
                <br />
                Clients will not be able to book when your business is on holiday.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle>Edit Holiday</DialogTitle>
              <DialogDescription>
                Modify the start and end date and time of an existing holiday.
              </DialogDescription>
            </>
          )}

        </DialogHeader>
        <form onSubmit={mode === "ADD" ? createHolidays : editHolidays} className="space-y-4">
          {/* Start Date & Time */}
          <div className="flex justify-between items-center">
            <Label htmlFor="datetime">Start Date & Time</Label>
            <div className="flex gap-4 w-full max-w-[300px]">
              <div className="flex flex-col gap-3 w-full">
                <Popover open={fromDateTimeSelectOpen} onOpenChange={setFromDateTimeSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-full justify-between font-normal"
                    >
                      {fromDateTime ? fromDateTime.toLocaleDateString("de-DE") : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDateTime}
                      captionLayout="dropdown"
                      weekStartsOn={1}
                      onSelect={(date) => {
                        if (!date) return;
                        const currentTime = fromDateTime ? fromDateTime : new Date();
                        const updatedDateTime = new Date(date);
                        updatedDateTime.setHours(currentTime.getHours());
                        updatedDateTime.setMinutes(currentTime.getMinutes());
                        updatedDateTime.setSeconds(currentTime.getSeconds());
                        setFromDateTime(date)
                        setFromDateTimeSelectOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <TimeSelect
                step={business?.timeSlotSizeMin}
                openingHours={business?.openingHours[fromDateTime?.getDay() ?? 0]}
                defaultValue={fromDateTime ? fromDateTime.toTimeString().slice(0, 5) : ""}
                onSelect={(value) => {
                  if (!fromDateTime) return;
                  const [hours, minutes] = value.split(":").map(Number);
                  const updatedDateTime = new Date(fromDateTime);
                  updatedDateTime.setHours(hours, minutes, 0, 0);
                  setFromDateTime(updatedDateTime);
                }}
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="flex justify-between items-center">
            <Label htmlFor="datetime">End Date & Time</Label>
            <div className="flex gap-4 w-full max-w-[300px]">
              <div className="flex flex-col gap-3 w-full">
                <Popover open={toDateTimeSelectOpen} onOpenChange={setToDateTimeSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-full justify-between font-normal"
                    >
                      {toDateTime ? toDateTime.toLocaleDateString("de-DE") : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDateTime}
                      captionLayout="dropdown"
                      weekStartsOn={1}
                      onSelect={(date) => {
                        if (!date) return;
                        const currentTime = toDateTime ? toDateTime : new Date();
                        const updatedDateTime = new Date(date);
                        updatedDateTime.setHours(currentTime.getHours());
                        updatedDateTime.setMinutes(currentTime.getMinutes());
                        updatedDateTime.setSeconds(currentTime.getSeconds());
                        setToDateTime(date)
                        setToDateTimeSelectOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <TimeSelect
                step={business?.timeSlotSizeMin}
                defaultValue={toDateTime ? toDateTime.toTimeString().slice(0, 5) : ""}
                onSelect={(value) => {
                  if (!toDateTime) return;
                  const [hours, minutes] = value.split(":").map(Number);
                  const updatedDateTime = new Date(toDateTime);
                  updatedDateTime.setHours(hours, minutes, 0, 0);
                  setToDateTime(updatedDateTime);
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : mode === "ADD" ? <PlusIcon /> : <PencilIcon />}
              {mode === "ADD" ? "Add Holiday" : "Save Changes"}
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
              <DialogTitle>Delete Holiday</DialogTitle>
              <DialogDescription>
                Deletes this holiday.
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
                    <Button onClick={deleteHolidays} variant="destructive" type="button">
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
                    Delete Holiday
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
