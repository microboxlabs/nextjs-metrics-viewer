"use client";
import { UserRole } from "@/domain/users/model";
import { Navbar } from "flowbite-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";

type Props = {
  session: Session | null;
};

function AppNavbar({ session }: Props) {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="/">
        <GoHomeFill className="size-7 text-black text-opacity-60" />
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
            {session.user.role === UserRole.Admin && (
              <Navbar.Link as={Link} href="/upload_data">
                Subir data
              </Navbar.Link>
            )}
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
