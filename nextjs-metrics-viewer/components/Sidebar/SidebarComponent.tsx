"use client";

import { Sidebar } from "flowbite-react";
import { BiBuoy } from "react-icons/bi";
import { useSidebarStore } from "@/providers/SidebarStateProvider";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

export default function SidebarComponent() {
  const { open, setOpen } = useSidebarStore((state) => state);
  return (
    <Sidebar
      className={`relative left-0 transition-all duration-500 ease-in-out ${open ? "w-96" : "w-16"}`}
      aria-label="Sidebar with content separator example"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            {open && "Dashboard"}
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiViewBoards}>
            {open && "Kanban"}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Upgrade to Pro
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiViewBoards}>
            Documentation
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={BiBuoy}>
            Help
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
