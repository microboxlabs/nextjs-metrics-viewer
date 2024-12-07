"use client";
import { Navbar } from "flowbite-react";
import Link from "next/link";
export default function NavbarComponent() {
  return (
    <Navbar
      fluid
      rounded
      className="sticky top-0 z-30 h-16 w-screen items-center bg-slate-50"
    >
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Metrics Viewer
        </span>
      </Navbar.Brand>
    </Navbar>
  );
}
