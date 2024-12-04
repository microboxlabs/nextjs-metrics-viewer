import { auth } from "@/auth";
import Image from "next/image";
import Account from "@/public/account.png";
import { getUser } from "@/actions/user";
import Divider from "@/components/Divider/DividerComponent";
import ProfileEditForm from "./Components/Form/ProfileEditForm";
export default async function AccountPage() {
  const id = await auth().then((data) => data?.user.id);
  const user = await getUser(id ? parseInt(id) : 0);
  return (
    <>
      <section className="mt-1 flex flex-col items-center justify-center md:m-0">
        <h1 className="my-3 text-center text-3xl">Profile information</h1>
        <p className="my-6 text-center text-sm font-bold">
          You must save any change. Otherwise the data will not upload
        </p>
        <div className="relative size-20 md:size-24">
          <Image src={Account} alt="Profile Photo" priority></Image>
        </div>
        <div className="mt-6 flex flex-row">
          <p className="text-2xl font-semibold">
            {user?.name} {user?.lastname}
          </p>
        </div>
      </section>
      <div className="mt-10 size-full">
        <h3 className="text-2xl">Update profile info</h3>
        <Divider />
        <div className="flex items-center justify-center">
          <ProfileEditForm
            id={id ? id : ""}
            name={user?.name ? user?.name : ""}
            lastname={user?.lastname ? user?.lastname : ""}
            email={user?.email ? user?.email : ""}
          />
        </div>
      </div>
    </>
  );
}
