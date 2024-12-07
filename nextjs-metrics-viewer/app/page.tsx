import { DarkThemeToggle } from "flowbite-react";
import LoginComponent from "@/app/components/Login/LoginComponent";
import Image from "next/image";
import Background from "@/public/background";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <div className="hidden h-screen w-3/5 md:block">
        <Background className="size-full object-cover" />
      </div>
      <div className="flex size-full h-screen items-center justify-center md:w-2/5">
        <LoginComponent />
      </div>
    </main>
  );
}
