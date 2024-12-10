import { getServerSession } from "next-auth/next";
import AppNavbar from ".";
import { authOptions } from "@/app/api/auth/[...nextauth]/options/credentials";

async function NavbarWrapper() {
  const session = await getServerSession(authOptions);

  return (
    <nav>
      <AppNavbar session={session} />
    </nav>
  );
}

export { NavbarWrapper };
