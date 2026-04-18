import React, { memo } from "react";
import { AppSidebar } from "./app-sidebar";
import { MobileHeaderNavUser } from "./nav-user";
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
            <div className="flex w-full items-center justify-between gap-2 px-3 py-2 lg:hidden">
              <div className="inline-flex shrink-0">
                <SidebarTrigger className="text-sidebar-foreground" />
              </div>
              <MobileHeaderNavUser />
            </div>
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
});

export default AppLayout;
