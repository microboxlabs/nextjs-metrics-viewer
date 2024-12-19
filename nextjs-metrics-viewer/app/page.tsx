"use client";

import { DarkThemeToggle } from "flowbite-react";

export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl">
        Welcome to the <span className="text-secondary">Metrics Dashboard</span>
      </h1>
      <p className="text-lg text-tertiary">
        Your one-stop solution for managing and visualizing metrics effectively.
      </p>
      <DarkThemeToggle />
    </main>
  );
}
