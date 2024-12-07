"use client";

import * as React from "react";
import { Sidebar } from "flowbite-react";
import { FiUser } from "react-icons/fi";
import { CgLogOut } from "react-icons/cg";
import { SlGraph } from "react-icons/sl";
import { signOutAction } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import { FaDatabase } from "react-icons/fa6";
import { RxUpload } from "react-icons/rx";
import { useSessionStore } from "@/lib/zustand/providers/SessionStateProvider";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import { useMetricsStore } from "@/lib/zustand/providers/MetricsStateProvider";
import { Session } from "next-auth";
export default function SidebarComponent() {
  const { setSession, connect, on } = useSessionStore((store) => store);
  const { showToast } = useNotificationStore((store) => store);
  const { getData, getTableData } = useMetricsStore((store) => store);
  const router = useRouter();
  const [open, setOpen] = React.useState<boolean>(false);
  const [userSession, setUserSession] = React.useState<Session | null>(null);

  React.useEffect(() => {}, []);

  React.useEffect(() => {
    const FetchSession = async () => {
      const session = await setSession();
      if (session) {
        setUserSession(session);
        connect();
        on("notification-client", (data) => {
          if (data) {
            if (session?.user.role == 1) {
              getData({});
              getTableData();
              showToast(data.msg, "info");
            }
          }
        });
      }
    };
    FetchSession();
  }, [setSession, connect, on, showToast]);

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
          {userSession?.user.role === 2 ? (
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
