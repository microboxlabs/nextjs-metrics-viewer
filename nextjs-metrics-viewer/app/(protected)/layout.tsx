import SidebarComponent from "@/components/Sidebar/SidebarComponent";
import { SidebarStoreProvider } from "@/providers/SidebarStateProvider";
import NavbarComponent from "@/components/Navbar/NavbarComponent";

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
          <main className="flex-1 p-4 md:p-10">
            <div className="ml-14 md:ml-10">{children}</div>
          </main>
        </div>
      </SidebarStoreProvider>
    </>
  );
}
