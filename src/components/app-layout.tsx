import React from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-center  bg-neutral-800 flex justify-center">
      <div className="w-full flex items-start gap-6 ">
        <SidebarProvider>
          <div className="hidden lg:flex">
            <AppSidebar />
          </div>

          <div className="flex-1 flex flex-col items-center">{children}</div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default AppLayout;
