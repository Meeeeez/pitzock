import { TableRow, TableCell } from "@/components/ui/table";
import { ReservationSpan } from "./ReservationSpan";
import type { ComponentProps } from "react";

interface StationRowProps {
  props?: ComponentProps<typeof TableCell>;
}

export function StationRow({ props }: StationRowProps) {
  return (
    <TableRow className={props?.className}>
      <TableCell className="bg-accent border-r">1 (8)</TableCell>
      <TableCell colSpan={4} className="px-0">
        <ReservationSpan name="Alice Johnson" pax={2} />
      </TableCell>
    </TableRow>
  )
}
