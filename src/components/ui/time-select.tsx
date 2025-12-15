import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectProps {
  step: number; // minutes, e.g. 5, 10, 15, 30
  defaultValue?: string; // "HH:mm"
  onSelect: (value: string) => void;
}

const generateTimeOptions = (step: number): string[] => {
  if (step <= 0) throw new Error("Step needs to be > 0");
  const times: string[] = [];
  times.push("--:--")
  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    times.push(`${h}:${m}`);
  }
  return times;
}

export function TimeSelect({ step, defaultValue, onSelect }: TimeSelectProps) {
  const options = useMemo(() => generateTimeOptions(step), [step]);
  return (
    <Select defaultValue={defaultValue} onValueChange={onSelect}>
      <SelectTrigger className="w-[120px]">
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
