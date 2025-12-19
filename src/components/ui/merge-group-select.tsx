import type { Dispatch, SetStateAction } from "react";
import { useListStationsByArea } from "@/hooks/station/use-list-stations-by-area";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "./multi-select";

interface MergeGroupSelectProps {
  areaId: string;
  members: string[];
  setMembers: Dispatch<SetStateAction<string[]>>;
}

export function MergeGroupSelect({ members, setMembers, areaId }: MergeGroupSelectProps) {
  const { data: stationsByArea, isPending } = useListStationsByArea(areaId);
  const placeholder = areaId ? "Select stations..." : "Select area first...";

  return (
    <MultiSelect values={members} onValuesChange={(newVal) => setMembers(newVal)}>
      <MultiSelectTrigger
        className="w-full max-w-[250px]"
        disabled={isPending || !areaId}
      >
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectGroup>
          {stationsByArea?.map((s) => (
            <MultiSelectItem key={s.id} value={s.id} disabled={members.includes(s.id)}>
              {s.name}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
}
