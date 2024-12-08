"use client";
import {
  Avatar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarToggle,
} from "flowbite-react";
import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <Navbar className="fixed top-0 w-full border-b border-gray-700 bg-black px-4">
      <div className="m-auto flex h-16 w-full max-w-screen-xl items-center justify-between">
        <NavbarBrand href="#">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-[#00BBCF]">
            MicroboxLabs
          </span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-1.jpg"
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </DropdownHeader>
            <DropdownItem onClick={() => signOut({ redirectTo: "/" })}>
              Sign out
            </DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
      </div>
    </Navbar>
  );
}
