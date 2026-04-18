import React, { memo } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export const AppLayout = memo(function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-sidebar bg-center">
      <div className="flex w-full min-w-0 items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        <SidebarProvider>
          {/* Sidebar component (Sheet on mobile, fixed on desktop) */}
          <AppSidebar />

          {/* Main content */}
          <div className="flex w-full min-w-0 flex-1 flex-col items-center">
            {/* Mobile top bar with a trigger to open the sidebar */}
            <div className="flex w-full items-center justify-start px-3 py-2 lg:hidden">
              {/* Place the trigger outside of the Sidebar so it can open the mobile Sheet */}
              <div className="inline-flex">
                <SidebarTrigger className="text-sidebar-foreground" />
              </div>
            </div>
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
});

export default AppLayout;
