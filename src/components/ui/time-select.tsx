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
  openingHours?: TTimeSlot[]; // Using your type
  defaultValue?: string;
  onSelect: (value: string) => void;
}

export function TimeSelect({ step, openingHours, defaultValue, onSelect }: TimeSelectProps) {
  if (!step) return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  )

  const options = useMemo(() => {
    if (openingHours && openingHours.length > 0) {
      const minuteTicks = flattenOpeningHours(openingHours, step);
      return minuteTicks.map(minutesToTime);
    }

    // If no opening hours provided, generate full 24h day
    const fullDay: string[] = [];
    for (let min = 0; min < 24 * 60; min += step) {
      fullDay.push(minutesToTime(min));
    }
    return fullDay;
  }, [step, openingHours]);

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