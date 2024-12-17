"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { role, setRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
  }, [role]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setRole(null); 
    router.push("/login"); 
  };

  return (
    <nav className="flex items-center justify-between bg-primary px-6 py-4 text-white shadow-md">
      {/* Brand */}
      <div className="text-lg font-bold">
        <Link href="/" className="hover:text-secondary">
          Metrics Dashboard
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4">
        {role === null && (
          <>
            <Link href="/login" className="hover:text-tertiary">
              Login
            </Link>
            <Link href="/register" className="hover:text-tertiary">
              Register
            </Link>
          </>
        )}
        {role === "regular" && (
          <>
            <Link href="/dashboard" className="hover:text-tertiary">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              Logout
            </button>
          </>
        )}
        {role === "admin" && (
          <>
            <Link href="/dashboard" className="hover:text-tertiary">
              Dashboard
            </Link>
            <Link href="/upload" className="hover:text-tertiary">
              Upload CSV
            </Link>
            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
