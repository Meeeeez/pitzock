import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DeleteWalkInDialog } from "@/components/ui/dialogs/walk-ins/delete-walk-in-dialog";
import { EditWalkInDialog } from "@/components/ui/dialogs/walk-ins/edit-walk-in-dialog";
import type { TStation } from "@/lib/types/station";
import type { TWalkInWithSeatedAt } from "@/lib/types/walk-in";
import type { HTMLAttributes } from "react";

interface WalkInSpanProps {
  station: TStation;
  walkIn: TWalkInWithSeatedAt;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export function WalkInSpan({ walkIn, station, className }: WalkInSpanProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <EditWalkInDialog walkIn={walkIn} station={station}>
          <div className={`h-9 rounded px-2 py-1 text-white cursor-pointer hover:opacity-90 transition-opacity bg-purple-500 overflow-hidden ${className}`}>
            <div className="truncate text-xs font-medium">Walk-In Client</div>
          </div>
        </EditWalkInDialog>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <DeleteWalkInDialog walkInId={walkIn.id} />
      </ContextMenuContent>
    </ContextMenu>
  )
}
