import { AddEditAreaDialog } from "@/components/ui/dialogs/add-edit-delete-area-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import type { TArea } from "@/lib/types/area";
import { useState, type ComponentProps } from "react";

interface AreaRowProps {
  area: TArea
  className?: ComponentProps<typeof TableRow>["className"];
}

export function AreaRow({ area, className }: AreaRowProps) {
  const [editAreaDialogOpen, setEditAreaDialogOpen] = useState(false);
  return (
    <>
      <AddEditAreaDialog mode="EDIT" editData={area} dialogOpen={editAreaDialogOpen} setDialogOpen={setEditAreaDialogOpen} />
      <TableRow onClick={() => setEditAreaDialogOpen(prev => !prev)} className={`bg-accent border-t-2 hover:cursor-pointer ${className}`}>
        <TableCell className="sticky left-0 z-10 font-sm font-semibold">
          <div className="flex items-center gap-1">
            {area.name}
          </div>
        </TableCell>
        <TableCell colSpan={999} />
      </TableRow>
    </>
  )
}
