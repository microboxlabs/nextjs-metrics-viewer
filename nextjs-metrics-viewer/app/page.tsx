import { DarkThemeToggle } from "flowbite-react";
import LoginComponent from "@/components/Login/LoginComponent";
import Image from "next/image";
import Background from "@/public/background";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <div className="hidden h-screen w-screen sm:block">
        <Background className="size-full object-cover" />
      </div>
      <LoginComponent />
    </main>
  );
}
