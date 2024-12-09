"use client";
import {
  Avatar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <Navbar className="fixed top-0 z-10 w-full border-b border-gray-700 bg-black px-4">
      <div className="m-auto flex h-16 w-full max-w-screen-xl items-center justify-between">
        <NavbarBrand href="/#">
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
                alt={session?.user.name ?? "User name"}
                img={session?.user.img}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-medium">
                {session?.user.name}
              </span>
              <span className="block truncate text-sm ">MicroboxLabs</span>
            </DropdownHeader>
            <DropdownItem
              className="text-red-500"
              onClick={() => signOut({ redirectTo: "/" })}
            >
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
}
