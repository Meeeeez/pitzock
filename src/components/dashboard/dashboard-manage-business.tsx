import { AreaEditor } from "../ui/area-editor";
import { BusinessClosureEditor } from "../ui/business-closure-editor";
import { OpeningHoursEditor } from "../ui/opening-hours-editor";
import { StationEditor } from "../ui/station-editor";

export function DashboardManageBusiness() {
  return (
    <div className="max-w-5xl w-full mx-auto p-4 space-y-6">
      <AreaEditor />
      <StationEditor />
      <BusinessClosureEditor />
      <OpeningHoursEditor />
    </div>
  )
}
