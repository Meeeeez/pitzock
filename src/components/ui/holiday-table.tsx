import { Spinner } from './spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { ManageHolidaysDialog } from './dialogs/manage-holidays-dialog';
import { Button } from './button';
import { PencilIcon } from 'lucide-react';
import { EmptyHolidays } from './empty/empty-holidays';
import { useListHolidays } from '@/hooks/holidays/use-list-holidays';

export function HolidayTable() {
  const { data: holidays, isPending } = useListHolidays();

  if (isPending) {
    return (
      <div className='w-full flex justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!holidays || holidays?.length === 0) {
    return <EmptyHolidays />
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
        {holidays.map((h, i) => {
          return (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{formatDateTime(h.from)}</TableCell>
              <TableCell>{formatDateTime(h.to)}</TableCell>
              <TableCell className='text-right'>
                <ManageHolidaysDialog mode='EDIT' editData={h}>
                  <Button variant="outline" size="icon">
                    <PencilIcon />
                  </Button>
                </ManageHolidaysDialog>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
