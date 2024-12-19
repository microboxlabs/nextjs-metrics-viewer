import React, { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";

interface SessionTimeoutModalProps {
    onRenew: () => void;
    onLogout: () => void;

}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ onRenew, onLogout }) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(60);

    useEffect(() => {
        const countdown = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    onLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [onLogout]);

    return (
        <Modal show={true} popup={true} onClose={() => { }}>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-4 text-center">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Your session is about to expire!
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your session will expire in {secondsLeft} seconds. Would you like to renew your session or logout?
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button color="success" onClick={onRenew}>
                            Renew Session
                        </Button>
                        <Button color="failure" onClick={onLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SessionTimeoutModal;
