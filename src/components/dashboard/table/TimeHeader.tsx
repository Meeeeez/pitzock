import { TableHead } from "@/components/ui/table"
import type { ComponentProps, ReactNode } from "react"

interface TimeHeaderProps {
  children?: ReactNode
  className?: ComponentProps<typeof TableHead>["className"];
}

export function TimeHeader({ children, className }: TimeHeaderProps) {
  return (
    <TableHead className={`min-w-24 text-center border-l ${className}`}>{children}</TableHead>
  )
}
