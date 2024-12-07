"use client";
import SidebarComponent from "@/app/components/Sidebar/SidebarComponent";
import NavbarComponent from "@/app/components/Navbar/NavbarComponent";
import { MetricsStoreProvider } from "@/lib/zustand/providers/MetricsStateProvider";
import { SessionStoreProvider } from "@/lib/zustand/providers/SessionStateProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SessionStoreProvider>
        <MetricsStoreProvider>
          <NavbarComponent />
          <div className="flex flex-row">
            <SidebarComponent />
            <main className="flex-1 pl-3 md:pl-10">
              <div className="ml-14 md:ml-10">{children}</div>
            </main>
          </div>
        </MetricsStoreProvider>
      </SessionStoreProvider>
    </>
  );
}
