import { Spinner } from './spinner';
import { useListClosedPeriods } from '@/hooks/closed-period/use-list-closed-periods';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import ManageClosedPeriodDialog from './dialogs/manage-closed-period-dialog';
import { Button } from './button';
import { PencilIcon } from 'lucide-react';
import { EmptyBusinessClosurePeriod } from './empty/empty-business-closure-period';

export function ClosedPeriodsTable() {
  const { data: closedPeriods, isPending } = useListClosedPeriods();

  if (isPending) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!closedPeriods || closedPeriods?.length === 0) {
    return <EmptyBusinessClosurePeriod />
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
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {closedPeriods.map((cp, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{formatDateTime(cp.from)}</TableCell>
              <TableCell>{formatDateTime(cp.to)}</TableCell>
              <TableCell className='text-right'>
                <ManageClosedPeriodDialog mode='EDIT' editData={cp}>
                  <Button variant="outline" size="icon">
                    <PencilIcon />
                  </Button>
                </ManageClosedPeriodDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
