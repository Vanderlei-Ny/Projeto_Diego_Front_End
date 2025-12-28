import React from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-center bg-neutral-800 flex justify-center min-h-screen">
      <div className="w-full flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-6 ">
        <SidebarProvider>
          <AppSidebar />

          <div className="flex-1 flex flex-col items-center w-full">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default AppLayout;
