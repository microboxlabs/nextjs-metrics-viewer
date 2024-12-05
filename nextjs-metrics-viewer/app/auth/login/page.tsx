"use client";
import { Card } from "flowbite-react";
import LoginFormComponent from "./components/form";

export default function LoginPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <Card className="w-full sm:w-4/6 md:w-2/6 lg:w-2/6 xl:w-1/6">
        <p className="text-2xl font-bold">Formulario de Ingreso</p>
        <LoginFormComponent />
      </Card>
    </main>
  );
}
