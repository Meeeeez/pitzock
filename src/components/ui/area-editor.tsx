import { PlusIcon } from "lucide-react";
import { AreaTable } from "./area-table";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { ManageAreaDialog } from "./dialogs/manage-area-dialog";

export function AreaEditor() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Manage Areas</CardTitle>
          <CardDescription>Add and edit Areas</CardDescription>
        </div>

        <ManageAreaDialog mode={"ADD"}>
          <Button variant="outline">
            <PlusIcon />
            Add Area
          </Button>
        </ManageAreaDialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <AreaTable />
      </CardContent>
    </Card>
  )
}
