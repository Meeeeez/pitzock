import { Fragment } from "react/jsx-runtime";
import { Spinner } from "../ui/spinner";
import { Table, TableHeader, TableRow, TableBody } from "../ui/table";
import { AreaRow } from "./table/AreaRow";
import { StationRow } from "./table/StationRow";
import { TimeHeader } from "./table/TimeHeader";
import { useAreas } from "@/hooks/use-areas";

interface DashboardReservationTimelineProps {
  date: Date | undefined;
}

export default function DashboardReservationTimeline({ date }: DashboardReservationTimelineProps) {
  const { data: areas, isPending } = useAreas();

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader className="min-w-24">
        <TableRow>
          {/* First one is empty */}
          <TimeHeader className="border-none" />
          {[...Array(48)].map((_, j) => (
            <TimeHeader key={j}>9:00</TimeHeader>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {areas?.map((area, i) => (
          <Fragment key={area.id || i}>
            <AreaRow area={area} />
            {[...Array(5)].map((_, j) => (
              <StationRow key={j}>{j}</StationRow>
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  )
}