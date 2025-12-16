import { MapPinHouse, PlusIcon } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../empty";
import { Button } from "../button";
import { ManageAreaDialog } from "../dialogs/manage-area-dialog";

export function EmptyAreas() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MapPinHouse />
        </EmptyMedia>
        <EmptyTitle>No Areas</EmptyTitle>
        <EmptyDescription>
          An Area is a section of your business. It is used to group stations together.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ManageAreaDialog mode="ADD">
          <Button variant="outline" size="sm">
            <PlusIcon />
            Add Area
          </Button>
        </ManageAreaDialog>
      </EmptyContent>
    </Empty>
  )
}
