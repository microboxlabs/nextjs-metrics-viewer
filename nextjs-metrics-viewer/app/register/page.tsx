"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [role, setRole] = useState<string>("regular");
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

        if (!validateEmail(email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!validatePassword(password)) {
            newErrors.password =
                "Password must be at least 8 characters long, contain uppercase, lowercase, and a special character.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password, role }),
                });

                if (response.ok) {
                    setMessage("Registration successful! Redirecting to login...");
                    setTimeout(() => router.push("/login"), 2000);
                } else {
                    const errorData = await response.json();
                    setMessage(`Error: ${errorData.message}`);
                }
            } catch (error) {
                setMessage("An error occurred during registration.");
            }
        }
    };

    const WarningIcon = createIconWrapper(Icons.Warning);
    const ErrorIcon = createIconWrapper(Icons.ErrorOutline);
    const SuccessIcon = createIconWrapper(Icons.CheckCircle);

    return (
        <main className="flex min-h-screen items-center justify-center bg-quaternary">
            <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
                {/* Header */}
                <div className="rounded-t-lg bg-primary px-6 py-4">
                    <h1 className="text-center text-3xl font-bold text-white">Sign Up</h1>
                    <p className="text-quaternary-light mt-1 text-center text-sm">
                        Create your account to access the dashboard.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-6 p-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    email: validateEmail(e.target.value) ? undefined : "Invalid email format.",
                                }));
                            }}
                            className={`mt-1 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-300" : "focus:ring-secondary-light"
                                }`}
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-500">
                                <WarningIcon className="size-5 text-red-500" />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    password: validatePassword(e.target.value)
                                        ? undefined
                                        : "Password must be at least 8 characters long, contain uppercase, lowercase, and a special character.",
                                }));
                            }}
                            className={`mt-1 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-300" : "focus:ring-secondary-light"
                                }`}
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-500">
                                <ErrorIcon className="size-5 text-red-500" />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword:
                                        e.target.value === password ? undefined : "Passwords do not match.",
                                }));
                            }}
                            className={`mt-1 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${errors.confirmPassword
                                    ? "border-red-500 focus:ring-red-300"
                                    : "focus:ring-secondary-light"
                                }`}
                            placeholder="Confirm your password"
                            required
                        />
                        {errors.confirmPassword && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-500">
                                <WarningIcon className="size-5 text-red-500" />
                                <span>{errors.confirmPassword}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-secondary">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="focus:ring-secondary-light mt-1 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
                        >
                            <option value="regular">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {message && (
                        <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-500">
                            <SuccessIcon className="size-5 text-green-500" />
                            <span>{message}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-secondary to-primary py-3 text-lg font-semibold text-white transition-all hover:opacity-90"
                    >
                        Register
                    </button>
                </form>
            </div>
        </main>
    );
};

export default RegisterPage;
