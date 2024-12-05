"use client";

import * as React from "react";
import { Sidebar } from "flowbite-react";
import { useSidebarStore } from "@/providers/SidebarStateProvider";
import { FiUser } from "react-icons/fi";
import { CgLogOut } from "react-icons/cg";
import { SlGraph } from "react-icons/sl";
import { signOutAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { FaDatabase } from "react-icons/fa6";
import { RxUpload } from "react-icons/rx";
import GetSession from "@/actions/get-session";

export default function SidebarComponent() {
  const { open, setOpen } = useSidebarStore((state) => state);
  const router = useRouter();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    const FetchSession = async () => {
      const session = await GetSession();
      if (session) {
        setSession(session.user);
      }
    };
    FetchSession();
  }, []);

  const HandleLogout = async () => {
    await signOutAction();
    router.push("/");
  };
  return (
    <Sidebar
      className={`fixed left-0 transition-all duration-500 ease-in-out ${open ? "w-80" : "w-16"} z-40`}
      aria-label="Sidebar with content separator example"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={SlGraph}>
            {open && "Dashboard"}
          </Sidebar.Item>
          {session?.role === 2 ? (
            <>
              <Sidebar.Item href="/upload" icon={RxUpload}>
                {open && "Upload Data"}
              </Sidebar.Item>
              <Sidebar.Item href="/manage" icon={FaDatabase}>
                {open && "Manage Data"}
              </Sidebar.Item>
            </>
          ) : null}
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/account" icon={FiUser}>
            {open && "Profile"}
          </Sidebar.Item>
          <Sidebar.Item onClick={() => HandleLogout()} icon={CgLogOut}>
            {open && "Logout"}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}