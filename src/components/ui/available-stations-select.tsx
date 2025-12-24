import { useListFittingStations } from "@/hooks/station/use-list-fitting-stations";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import type { TStation } from "@/lib/types/station";
import type { TMergeGroupWithMembers } from "@/lib/types/mergeGroup";
import { Spinner } from "./spinner";

interface AvailableStationSelectProps {
  pax: number;
  bringsPets: boolean;
  startsAt: string;
  endsAt: string;
  enabled?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  currentStation?: TStation | TMergeGroupWithMembers;
}

export function AvailableStationSelect({
  pax,
  bringsPets,
  startsAt,
  endsAt,
  enabled = true,
  defaultValue,
  onValueChange,
  currentStation
}: AvailableStationSelectProps) {
  const { data: fittingOptions, isPending } = useListFittingStations(
    pax,
    bringsPets,
    startsAt,
    endsAt,
    enabled,
    currentStation
  );
  const [singles, merges] = fittingOptions ?? [[], []];

  if (isPending) return (
    <div className="flex justify-center w-full">
      <Spinner />
    </div>
  );

  return (
    <Select disabled={!enabled} defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a station" />
      </SelectTrigger>
      <SelectContent>
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
        {merges.length > 0 && (
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

        {singles.length === 0 && merges.length === 0 &&
          <SelectGroup>
            <SelectLabel className="flex justify-center w-full uppercase">
              {currentStation ? "No other Stations fit this Reservation" : "No Stations fit this Reservation"}
            </SelectLabel>
          </SelectGroup>
        }
      </SelectContent>
    </Select>
  )
}
