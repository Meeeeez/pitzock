import { UsersIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface ReservationSpanProps {
  name: string;
  pax: number;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export function ReservationSpan({ name, pax, className }: ReservationSpanProps) {
  return (
    <div className={`flex justify-between h-9 rounded px-2 py-1 text-white cursor-pointer hover:opacity-90 transition-opacity bg-emerald-500 ${className}`}>
      <div className="truncate text-xs font-medium">{name}</div>
      <div className="flex items-start justify-start gap-1">
        <UsersIcon className="h-3 w-3 mt-0.5" />
        <div className="text-xs font-semibold">{pax}</div>
      </div>
    </div>
  )
}
