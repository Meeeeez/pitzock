import { TableCell, TableRow } from "@/components/ui/table";
import type { ComponentProps, ReactNode } from "react";

interface AreaRowProps {
  children?: ReactNode
  className?: ComponentProps<typeof TableRow>["className"];
}

export function AreaRow({ children, className }: AreaRowProps) {
  return (
    <TableRow className={`bg-accent border-t-2 ${className}`}>
      <TableCell className="sticky left-0 z-10 font-sm font-semibold">{children}</TableCell>
      <TableCell colSpan={999} />
    </TableRow>
  )
}
