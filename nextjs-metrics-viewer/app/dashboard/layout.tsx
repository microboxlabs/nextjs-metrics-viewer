import { Navbar } from "flowbite-react";
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
        <div className="flex h-5/6 flex-row">
          <SidebarComponent />
          <main className="w-96 p-4">{children}</main>
        </div>
      </SidebarStoreProvider>
    </>
  );
}
