import { DashboardHeader } from "@/components/dashboard-header";
import { useOutletContext } from "react-router";

type DashboardOutletContext = [Date | undefined, React.Dispatch<React.SetStateAction<Date | undefined>>];

export function Dashboard() {
  const [date, setDate] = useOutletContext<DashboardOutletContext>();

  return <><DashboardHeader date={date} /></>
}
