import { Fragment } from "react/jsx-runtime";
import { Spinner } from "../ui/spinner";
import { Table, TableBody } from "../ui/table";
import { AreaRow } from "./table/AreaRow";
import { StationRow } from "./table/StationRow";
import { TimelineHeader } from "./table/TimelineHeader";
import { useListAreas } from "@/hooks/area/use-list-areas";
import { useListStations } from "@/hooks/station/use-list-stations";
import type { TStation } from "@/lib/types/station";
import { useEffect, useState } from "react";
import type { TTimeSlot } from "@/lib/types/business";
import { BusinessClosed } from "../ui/empty/business-closed";
import { useGetBusiness } from "@/hooks/business/use-get-business";
import { BusinessInactive } from "../ui/empty/business-inactive";

interface DashboardReservationTimelineProps {
  selectedDate: Date;
}

export default function DashboardReservationTimeline({ selectedDate }: DashboardReservationTimelineProps) {
  const { data: areas, isPending: areasPending } = useListAreas();
  const { data: stations, isPending: stationsPending } = useListStations();
  const { data: business, isPending: businessPending } = useGetBusiness();

  const [openingHoursAtSelectedDate, setOpeningHoursAtSelectedDate] = useState<TTimeSlot[]>([]);

  useEffect(() => {
    if (!business || !business.openingHours) return;
    // getDay() returns the weekday index with 0 being sunday - transformation so 0 is monday  
    const selectedWeekday = (selectedDate.getDay() + 6) % 7;
    setOpeningHoursAtSelectedDate(business.openingHours[selectedWeekday]);
  }, [business, selectedDate])

  if (areasPending || stationsPending || businessPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  if (!business?.isActive) {
    return <BusinessInactive />
  }

  if (false) {
    return <BusinessClosed selectedDate={selectedDate} reason="The business is closed on this date according to its configured holidays." />;
  }

  if (openingHoursAtSelectedDate.length === 0) {
    return <BusinessClosed selectedDate={selectedDate} reason="The business is closed on this date according to its configured opening hours." />;
  }

  const stationsByArea = stations?.reduce((acc, station) => {
    const key = station.areaId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(station);
    return acc;
  }, {} as Record<string, TStation[]>);

  return (
    <Table>
      <TimelineHeader openingHours={openingHoursAtSelectedDate} />
      <TableBody>
        {areas?.map(area => {
          const areaStations = stationsByArea?.[area.id] ?? [];
          return (
            <Fragment key={area.id}>
              <AreaRow area={area} />
              {areaStations.map(station => (
                <StationRow
                  key={station.id}
                  station={station}
                  areaOfStation={area}
                />
              ))}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  )
}