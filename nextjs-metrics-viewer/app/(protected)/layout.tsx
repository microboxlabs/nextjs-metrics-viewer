import SidebarComponent from "@/components/Sidebar/SidebarComponent";
import { SidebarStoreProvider } from "@/providers/SidebarStateProvider";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import { MetricsStoreProvider } from "@/providers/MetricsStateProvider";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarStoreProvider>
        <NavbarComponent />
        <div className="flex flex-row">
          <SidebarComponent />
          <main className="flex-1 pl-3 md:pl-10">
            <div className="ml-14 md:ml-10">
              <MetricsStoreProvider>{children}</MetricsStoreProvider>
            </div>
          </main>
        </div>
      </SidebarStoreProvider>
    </>
  );
}
