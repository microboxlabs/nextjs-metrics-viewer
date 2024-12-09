import GetSession from "@/app/actions/get-session";
import Image from "next/image";
import Account from "@/public/account.png";
import { getUser } from "@/app/actions/user";
import Divider from "@/app/components/Divider/DividerComponent";
import ProfileEditForm from "./Components/Form/ProfileEditForm";
export default async function AccountPage() {
  const session = await GetSession()
  const user = session?.user
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
            {user?.name}
          </p>
        </div>
      </section>
      <div className="mt-10 size-full">
        <h3 className="text-2xl">Update profile info</h3>
        <Divider />
        <div className="flex items-center justify-center">
          <ProfileEditForm
            id={user?.id? user?.id : ""}
            name={user?.name ? user?.name : ""}
            email={user?.email ? user?.email : ""}
          />
        </div>
      </div>
    </>
  );
}
