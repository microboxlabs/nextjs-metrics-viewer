import { auth } from "@/auth";
import Image from "next/image";
import Account from "@/public/account.png";
export default async function AccountPage() {
  const user = await auth().then((data) => data?.user);
  return (
    <>
      <section className="flex flex-col items-center justify-center">
        <div className="size-32">
          <Image
            src={!user?.image ? Account : user.image}
            alt="Profile Photo"
          ></Image>
        </div>
        <div className="flex flex-row">
          <p>{user?.name}</p>
        </div>
      </section>
    </>
  );
}
