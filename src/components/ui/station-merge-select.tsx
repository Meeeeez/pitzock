import { useListStationsByArea } from "@/hooks/station/use-list-stations-by-area";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "./multi-select";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useListStationMergesByStation } from "@/hooks/mergableStation/use-list-station-merges-by-station";

interface StationMergeSelectProps {
  mergableWith: string[];
  setMergableWith: Dispatch<SetStateAction<string[]>>;
  stationId?: string;
  areaId: string;
}

export function StationMergeSelect({ mergableWith, setMergableWith, areaId, stationId }: StationMergeSelectProps) {
  const { data: stationsByArea, isPending } = useListStationsByArea(areaId);
  const { data: mergableStations } = stationId ? useListStationMergesByStation(stationId) : {};

  // (edit mode) get already entered station merges for this station and display them
  useEffect(() => {
    if (mergableStations) setMergableWith(mergableStations.map((s) => s.mergableWith))
  }, [mergableStations])

  // don't show this station as an option
  const filteredStations = stationsByArea?.filter((s) => s.id !== stationId);

  return (
    <MultiSelect values={mergableWith} onValuesChange={(newVal) => setMergableWith(newVal)}>
      <MultiSelectTrigger
        className="w-full max-w-[250px]"
        disabled={isPending || filteredStations?.length === 0}
      >
        <MultiSelectValue placeholder={filteredStations?.length === 0 ? "No other stations" : "Select stations..."} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {filteredStations?.map((s) => (
            <MultiSelectItem key={s.id} value={s.id}>
              {s.name}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
