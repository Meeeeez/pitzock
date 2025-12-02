import { EditAreaDialog } from "@/components/ui/dialogs/edit-area-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState, type ComponentProps, type ReactNode } from "react";

interface AreaRowProps {
  children?: ReactNode
  className?: ComponentProps<typeof TableRow>["className"];
}

export function AreaRow({ children, className }: AreaRowProps) {
  const [editAreaDialogOpen, setEditAreaDialogOpen] = useState(false);
  return (
    <>
      <EditAreaDialog open={editAreaDialogOpen} onOpenStateChange={setEditAreaDialogOpen} />
      <TableRow onClick={() => setEditAreaDialogOpen(prev => !prev)} className={`bg-accent border-t-2 hover:cursor-pointer ${className}`}>
        <TableCell className="sticky left-0 z-10 font-sm font-semibold">
          <div className="flex items-center gap-1">
            {children}
          </div>
        </TableCell>
        <TableCell colSpan={999} />
      </TableRow>
    </>
  )
}
