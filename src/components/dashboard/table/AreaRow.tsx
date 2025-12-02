import { TableCell, TableRow } from "@/components/ui/table";
import type { ComponentProps, ReactNode } from "react";

interface AreaRowProps {
  children?: ReactNode
  className?: ComponentProps<typeof TableRow>["className"];
}

export function AreaRow({ children, className }: AreaRowProps) {
  return (
    <TableRow className={`bg-accent border-t-2 ${className}`}>
      <TableCell colSpan={999} className="font-sm font-semibold">{children}</TableCell>
    </TableRow>
  )
}
