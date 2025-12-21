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
import { useListHolidays } from "@/hooks/holidays/use-list-holidays";
import { isDateInHoliday } from "@/lib/utils";
import { useListReservationsAtDateByStations } from "@/hooks/reservation/use-list-reservations-at-date-by-stations";

interface DashboardReservationTimelineProps {
  selectedDate: Date;
}

export default function DashboardReservationTimeline({ selectedDate }: DashboardReservationTimelineProps) {
  const { data: areas, isPending: areasPending } = useListAreas();
  const { data: business, isPending: businessPending } = useGetBusiness();
  const { data: stations, isPending: stationsPending } = useListStations();
  const { data: holidays, isPending: holidaysPending } = useListHolidays();
  const { data: reservationsAtDateByStations, isPending: reservationsPending } = useListReservationsAtDateByStations(selectedDate);
  const [openingHoursAtSelectedDate, setOpeningHoursAtSelectedDate] = useState<TTimeSlot[]>([]);
  const isPending = areasPending || stationsPending || businessPending || holidaysPending || reservationsPending;

  useEffect(() => {
    if (!business || !business.openingHours) return;
    // getDay() returns the weekday index with 0 being sunday - transformation so 0 is monday  
    const selectedWeekday = (selectedDate.getDay() + 6) % 7;
    setOpeningHoursAtSelectedDate(business.openingHours[selectedWeekday]);
  }, [business, selectedDate])

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    )
  }

  if (!business?.isActive) {
    return <BusinessInactive />
  }

  if (isDateInHoliday(selectedDate, holidays)) {
    return <BusinessClosed type="HOLIDAYS" selectedDate={selectedDate} />;
  }

  if (openingHoursAtSelectedDate.length === 0) {
    return <BusinessClosed type="OPENINGHOURS" selectedDate={selectedDate} />;
  }

  // make kind of a tutorial where users need to setup the app
  if (areas?.length === 0 || stations?.length === 0) {
    return "tutorial"
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
                  openingHours={openingHoursAtSelectedDate}
                  reservations={reservationsAtDateByStations?.get(station.id) ?? []}
                />
              ))}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  )
}