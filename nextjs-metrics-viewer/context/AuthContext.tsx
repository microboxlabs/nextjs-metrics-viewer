"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    token: string | null;
    role: string | null;
    setToken: (token: string | null) => void;
    setRole: (role: string | null) => void;
    renewSession: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type DecodedToken = {
    exp: number;
    id: number;
    role: string;
    [key: string]: any;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); 
    const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
    const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setToken(storedToken);
            try {
                const decoded: DecodedToken = jwtDecode(storedToken);
                setTokenExpiration(decoded.exp * 1000); 
            } catch (error) {
                console.error("Error decoding token:", error);
                setToken(null);
                setRole(null);
            }
        }
    }, []);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                if (!token) {
                    setRole(null);
                    return;
                }

                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRole(data.user?.role || null);

                    const newToken = data.token;
                    if (newToken) {
                        setToken(newToken);
                        localStorage.setItem("authToken", newToken);
                        const decoded: DecodedToken = jwtDecode(newToken);
                        setTokenExpiration(decoded.exp * 1000); 
                    }

                } else {
                    setRole(null);
                    setToken(null);
                    localStorage.removeItem("authToken"); 
                }
            } catch (error) {
                console.error("Error fetching role:", error);
                setRole(null);
                setToken(null);
                localStorage.removeItem("authToken"); 
            }
        };
        fetchRole();
    }, [token]);

    useEffect(() => {
        if (!tokenExpiration) return;

        const checkTime = () => {
            const now = Date.now();
            const timeLeft = tokenExpiration - now;

            if (timeLeft <= 60000 && timeLeft > 0) { 
                setShowSessionModal(true);
            } else if (timeLeft <= 0) { 
                logout();
            }
        };

        const timer = setInterval(checkTime, 1000);

        return () => clearInterval(timer);
    }, [tokenExpiration]);

    const renewSession = async () => {
        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                credentials: "include",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                const newToken = data.token;
                if (newToken) {
                    setToken(newToken);
                    localStorage.setItem("authToken", newToken);
                    const decoded: DecodedToken = jwtDecode(newToken);
                    setTokenExpiration(decoded.exp * 1000); 
                }
            } else {
                throw new Error("Failed to renew session");
            }
        } catch (error) {
            console.error("Error renewing session:", error);
            logout();
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            try {
                const decoded: DecodedToken = jwtDecode(storedToken);
                setToken(storedToken);
                setRole(decoded.role);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("authToken");
            }
        }
        setLoading(false); 
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setToken(null);
            setRole(null);
            localStorage.removeItem("authToken");
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ token, role, setToken, setRole, renewSession, logout }}>
            {children}

        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
