

import {
  Command,
} from "lucide-react"
import { NavBusiness } from "@/components/ui/nav-business"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AddReservationDialog } from "./dialogs/add-reservation-dialog"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
}

interface DashboardSidebarProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  props?: React.ComponentProps<typeof Sidebar>;
}

export function DashboardSidebar({ date, setDate, props }: DashboardSidebarProps) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="my-1" />
      <SidebarContent className="justify-between px-2 py-4">
        <div>
          <Button onClick={() => setDate(new Date())} variant="outline" className="w-full">Today</Button>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full bg-neutral"
          />
        </div>
        <AddReservationDialog />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavBusiness user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
