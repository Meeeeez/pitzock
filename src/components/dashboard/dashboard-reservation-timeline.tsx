import { Table, TableHeader, TableRow, TableBody } from "../ui/table";
import { AreaRow } from "./table/AreaRow";
import { StationRow } from "./table/StationRow";
import { TimeHeader } from "./table/TimeHeader";

interface DashboardReservationTimelineProps {
  date: Date | undefined;
}

export default function DashboardReservationTimeline({ date }: DashboardReservationTimelineProps) {
  return (
    <Table>
      <TableHeader className="min-w-24">
        <TableRow>
          <TimeHeader className="border-none" /> {/* First one is empty */}
          {[...Array(48)].map(() => {
            return <TimeHeader>9:00</TimeHeader>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        <AreaRow>Area 1</AreaRow>
        <StationRow />
        <StationRow />
        <StationRow />
        <AreaRow>Area 2</AreaRow>
        <StationRow />
        <StationRow />
      </TableBody>
    </Table>
  )
}