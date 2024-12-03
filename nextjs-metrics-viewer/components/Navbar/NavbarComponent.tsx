"use client";
import { useSidebarStore } from "@/providers/SidebarStateProvider";
import { Navbar, Button } from "flowbite-react";
import { TfiAlignJustify, TfiClose } from "react-icons/tfi";

export default function NavbarComponent() {
  const { open, setOpen } = useSidebarStore((state) => state);
  return (
    <Navbar fluid rounded className="w-screen bg-slate-50">
      <Button
        size="xs"
        color="light"
        className="focus:bg-none"
        onClick={() => setOpen()}
      >
        {open ? (
          <TfiClose className="size-5" />
        ) : (
          <TfiAlignJustify className="size-5" />
        )}
      </Button>
    </Navbar>
  );
}
