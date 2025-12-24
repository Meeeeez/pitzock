import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TTimeSlot } from "@/lib/types/business";
import { flattenOpeningHours, minutesToTime } from "@/lib/time-slots";
import { Spinner } from "./spinner";

interface TimeSelectProps {
  step?: number;
  after?: Date; // if this is set: only show values after this datetime
  openingHours?: TTimeSlot[]; // Using your type
  defaultValue?: string;
  onSelect: (value: string) => void;
}

export function TimeSelect({ step, openingHours, after, defaultValue, onSelect }: TimeSelectProps) {
  if (!step) return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  )

  const options = useMemo(() => {
    let minuteTicks: number[] = [];

    if (openingHours && openingHours.length > 0) {
      minuteTicks = flattenOpeningHours(openingHours, step);
    } else {
      for (let min = 0; min < 24 * 60; min += step) {
        minuteTicks.push(min);
      }
    }

    const now = new Date();
    const isToday = after ? after.toDateString() === now.toDateString() : false;

    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      // Only keep ticks that are in the future or the closest one to the last step
      minuteTicks = minuteTicks.filter(tick => tick >= currentMinutes - step);
    }

    return minuteTicks.map(minutesToTime);
  }, [step, openingHours, after]);


  return (
    <Select value={defaultValue} onValueChange={onSelect}>
      <SelectTrigger className="w-full bg-background">
        <SelectValue placeholder="--:--" />
      </SelectTrigger>

      <SelectContent className="max-h-64">
        {options.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}