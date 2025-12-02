import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardReservationTimeline from "@/components/dashboard/dashboard-reservation-timeline";
import { Separator } from "@/components/ui/separator";
import { useOutletContext } from "react-router";

type DashboardOutletContext = [Date | undefined, React.Dispatch<React.SetStateAction<Date | undefined>>];

export function Dashboard() {
  const [date] = useOutletContext<DashboardOutletContext>();
  return (
    <div>
      <DashboardHeader date={date} />
      <Separator />
      <DashboardReservationTimeline date={date} />
    </div>
  )
}
