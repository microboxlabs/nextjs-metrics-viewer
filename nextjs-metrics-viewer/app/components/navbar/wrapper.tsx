import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import AppNavbar from ".";

async function NavbarWrapper() {
  const session = await getServerSession(authOptions);

  return (
    <nav>
      <AppNavbar session={session} />
    </nav>
  );
}

export { NavbarWrapper };
