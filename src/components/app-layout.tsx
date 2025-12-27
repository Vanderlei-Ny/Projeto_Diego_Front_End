import React from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-gray-700 flex justify-center px-4 py-10">
      <div className="w-full max-w-[1400px] flex items-start gap-6">
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
