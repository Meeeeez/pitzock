import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { ManageHolidaysDialog } from "./dialogs/manage-holidays-dialog";
import { HolidayTable } from "./holiday-table";
import { PlusIcon } from "lucide-react";
import { Button } from "./button";

export function HolidayEditor() {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Holidays</CardTitle>
          <CardDescription>Add or edit Holidays</CardDescription>
        </div>
        <ManageHolidaysDialog mode="ADD">
          <Button variant="outline">
            <PlusIcon />
            Add Holidays
          </Button>
        </ManageHolidaysDialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <HolidayTable />
      </CardContent>
    </Card>
  )
}
