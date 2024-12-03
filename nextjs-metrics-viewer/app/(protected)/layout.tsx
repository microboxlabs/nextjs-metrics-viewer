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
        <div className="flex h-5/6 w-full flex-row">
          <SidebarComponent />
          <main className="w-full flex-1 p-4 md:p-8">
            <div className="flex max-h-screen items-center justify-center">
              {children}
            </div>
          </main>
        </div>
      </SidebarStoreProvider>
    </>
  );
}
