"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button } from "flowbite-react";
import { Icons } from "@/components/icons";
import type { SVGProps } from "react";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";


function createIconWrapper(
  MUIIcon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
): React.FC<SVGProps<SVGSVGElement>> {
  return function WrappedIcon(props: SVGProps<SVGSVGElement>) {
    const { className } = props;
    return <MUIIcon className={className} fontSize="inherit" />;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { role, setRole } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("expired") === "true") {
      setMessage("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (role) {
      router.push("/dashboard");
    }
  }, [role, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token); 
        const roleResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          setRole(roleData.user?.role || null);
          router.push("/dashboard");
        } else {
          setMessage("Failed to fetch user role after login.");
        }
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred during login.");
    }
  };

  if (role) return <p className="mt-10 text-center text-lg font-medium">Redirecting...</p>;

  const getMessageType = () => {
    if (!message) return { type: "info", Icon: Icons.Info };

    const msgLower = message.toLowerCase();
    if (msgLower.includes("error") || msgLower.includes("failed") || msgLower.includes("an error")) {
      return { type: "failure", Icon: Icons.ErrorOutline };
    } else if (msgLower.includes("expired")) {
      return { type: "info", Icon: Icons.Info };
    } else if (msgLower.includes("successfully")) {
      return { type: "success", Icon: Icons.CheckCircle };
    } else {
      return { type: "info", Icon: Icons.Info };
    }
  };

  const { type, Icon } = getMessageType();

  const WrappedIcon = Icon ? createIconWrapper(Icon) : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-quaternary px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="rounded-t-lg bg-primary px-6 py-4">
          <h1 className="text-center text-3xl font-bold text-white">Log In</h1>
          <p className="text-quaternary-light mt-1 text-center text-sm">
            Welcome back! Please enter your details to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6 p-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-secondary-light mt-1 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-secondary-light mt-1 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
              placeholder="Enter your password"
              required
            />
          </div>

          {message && (
            <Alert
              color={type}
              icon={WrappedIcon}
              className="text-sm"
            >
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            gradientMonochrome="purple"
            className="w-full py-3 text-lg font-semibold"
          >
            Log in
          </Button>
        </form>
      </div>
    </main>
  );
}
