import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import ManageClosedPeriodDialog from "./dialogs/manage-closed-period-dialog";
import { ClosedPeriodsTable } from "./closed-periods-table";
import { PlusIcon } from "lucide-react";
import { Button } from "./button";

export function BusinessClosureEditor() {
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Business Closure Periods</CardTitle>
          <CardDescription>Add or edit Business Closure Periods</CardDescription>
        </div>
        <ManageClosedPeriodDialog mode="ADD">
          <Button variant="outline">
            <PlusIcon />
            Add Closed Period
          </Button>
        </ManageClosedPeriodDialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <ClosedPeriodsTable />
      </CardContent>
    </Card>
  )
}
