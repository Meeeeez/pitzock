import { ManageAreaDialog } from "@/components/ui/dialogs/manage-area-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import type { TArea } from "@/lib/types/area";
import { CircleXIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";

interface AreaRowProps {
  area: TArea
  className?: ComponentProps<typeof TableRow>["className"];
}

export function AreaRow({ area, className }: AreaRowProps) {
  const [editAreaDialogOpen, setEditAreaDialogOpen] = useState(false);
  return (
    <>
      <ManageAreaDialog mode="EDIT" editData={area} dialogOpen={editAreaDialogOpen} setDialogOpen={setEditAreaDialogOpen} />
      <TableRow onClick={() => setEditAreaDialogOpen(prev => !prev)} className={`bg-accent border-t-2 hover:cursor-pointer ${!area.isActive && 'bg-red-100 hover:bg-red-50'} ${className}`}>
        <TableCell className="sticky left-0 z-10 font-sm font-semibold">
          <div className="flex items-center gap-2">
            <span>{area.name}</span>
            {!area.isActive && <CircleXIcon className="w-3 h-3 mt-1" />}
          </div>
        </TableCell>
        <TableCell colSpan={999} />
      </TableRow>
    </>
  )
}
