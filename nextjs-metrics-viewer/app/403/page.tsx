"use client";

import React from "react";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-quaternary p-4 text-secondary">
      <h1 className="text-error text-4xl font-bold">403 - Unauthorized</h1>
      <p className="text-lg text-secondary">
        You do not have permission to access this page.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="rounded bg-tertiary px-4 py-2 text-white transition-colors hover:bg-primary"
      >
        Go to Dashboard
      </button>
    </main>
  );
};

export default UnauthorizedPage;
