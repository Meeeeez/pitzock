import DashboardReservationTimeline from "@/components/dashboard/dashboard-reservation-timeline";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardManageBusiness } from "@/components/dashboard/dashboard-manage-business";

export function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const localeDate = date?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric"
  })

  return (
    <SidebarProvider>
      <DashboardSidebar date={date} setDate={setDate} />
      <SidebarInset id="hallo" className="overflow-hidden h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="py-4 text-xl font-semibold">{localeDate}</h1>
          </div>
        </header>
        <Separator className="my-1" />
        <Tabs id="loter" defaultValue="timeline" className="h-full overflow-hidden">
          <DashboardHeader />
          <Separator />
          <TabsContent value="timeline" className="overflow-auto">
            <DashboardReservationTimeline date={date} />
          </TabsContent>
          <TabsContent value="manage-business">
            <DashboardManageBusiness />
          </TabsContent>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  )
}
