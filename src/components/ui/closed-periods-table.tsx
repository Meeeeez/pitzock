import { Spinner } from './spinner';
import { useListClosedPeriods } from '@/hooks/closed-period/use-list-closed-periods';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import ManageClosedPeriodDialog from './dialogs/manage-closed-period-dialog';
import { useState } from 'react';

export function ClosedPeriodsTable() {
  const [closedPeriodDialogOpen, setClosedPeriodDialogOpen] = useState(false);
  const { data: closedPeriods, isPending } = useListClosedPeriods();

  if (isPending) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!closedPeriods || closedPeriods?.length === 0) {
    return <p className='text-sm'>No Closure Periods yet</p>
  }

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {closedPeriods.map((cp, i) => {
          return (
            <>
              <ManageClosedPeriodDialog mode='EDIT' editData={cp} dialogOpen={closedPeriodDialogOpen} setDialogOpen={setClosedPeriodDialogOpen} />
              <TableRow key={i} onClick={() => setClosedPeriodDialogOpen(true)} className='hover:bg-neutral-200 hover:cursor-pointer'>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{formatDateTime(cp.from)}</TableCell>
                <TableCell>{formatDateTime(cp.to)}</TableCell>
              </TableRow>
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}
