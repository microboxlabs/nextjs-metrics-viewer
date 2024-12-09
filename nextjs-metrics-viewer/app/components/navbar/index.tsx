"use client";
import { Button, Navbar } from "flowbite-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  session: Session | null;
};

function AppNavbar({ session }: Props) {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          HOME
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {!session || !session.user ? (
          <Navbar.Link as={Link} href="/auth/login">
            Iniciar sesión
          </Navbar.Link>
        ) : (
          <>
            <Navbar.Link as={Link} href="/dashboard">
              Dashboard
            </Navbar.Link>
            <Navbar.Link as={Link} href="#" onClick={() => signOut()}>
              Cerrar sesión
            </Navbar.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
