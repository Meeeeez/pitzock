import { Fragment } from "react/jsx-runtime";
import { Spinner } from "../ui/spinner";
import { Table, TableHeader, TableRow, TableBody } from "../ui/table";
import { AreaRow } from "./table/AreaRow";
import { StationRow } from "./table/StationRow";
import { TimeHeader } from "./table/TimeHeader";
import { useGetAreasByBusiness } from "@/hooks/area/use-get-areas-by-business";
import { useGetStationsByBusiness } from "@/hooks/station/use-get-stations-by-business";
import type { TStation } from "@/lib/types/station";

interface DashboardReservationTimelineProps {
  date: Date | undefined;
}

export default function DashboardReservationTimeline({ date }: DashboardReservationTimelineProps) {
  const { data: areas, isPending: areasPending } = useGetAreasByBusiness();
  const { data: stations, isPending: stationsPending } = useGetStationsByBusiness();

  if (areasPending || stationsPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  const stationsByArea = stations?.reduce((acc, station) => {
    const key = station.areaId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(station);
    return acc;
  }, {} as Record<string, TStation[]>);

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
        {areas?.map(a => {
          const stations = stationsByArea?.[a.id] ?? [];

          return (
            <Fragment key={a.id}>
              <AreaRow area={a} />
              {stations.map(s => (
                <StationRow station={s} areaOfStation={a} key={s.id} />
              ))}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  )
}