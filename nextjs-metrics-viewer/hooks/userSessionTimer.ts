import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";

export const useSessionTimer = () => {
    const { token, renewSession, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            const expiryTime = decoded.exp * 1000;

            const checkTime = () => {
                const now = Date.now();
                const remaining = expiryTime - now;

                if (remaining <= 60000 && remaining > 0) {
                    setShowModal(true);
                    setTimeLeft(Math.floor(remaining / 1000));
                } else if (remaining <= 0) {
                    logout();
                }
            };

            checkTime();

            const interval = setInterval(checkTime, 1000);
            return () => clearInterval(interval);
        } catch (error) {
            console.error("Error decoding token:", error);
            logout();
        }
    }, [token, logout]);

    const handleRenewSession = async () => {
        await renewSession();
        setShowModal(false);
    };

    return { showModal, timeLeft, renewSession: handleRenewSession, logout };
};
