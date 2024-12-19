'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext'; // Asegúrate de que la ruta es correcta

interface IWebSocketContext {
    ws: WebSocket | null;
}

const WebSocketContext = createContext<IWebSocketContext>({ ws: null });

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const { token } = useAuth();
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [attempts, setAttempts] = useState<number>(0);

    useEffect(() => {
        if (!token) {
            return;
        }

        const connect = () => {
            const wsUrl = `ws://localhost:3001/?token=${token}`;
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                setAttempts(0); 
            };

            socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'data-updated') {
                        window.dispatchEvent(new Event('data-updated'));
                    }
                } catch (err) {
                    console.error('Error parseando mensaje:', err);
                }
            };

            socket.onclose = (event) => {
                if (attempts < 5) { 
                    const timeout = Math.min(10000, 1000 * 2 ** attempts); 
                    setTimeout(() => {
                        setAttempts((prev) => prev + 1);
                    }, timeout);
                }
            };

            socket.onerror = (error) => {
                console.error('Error en WebSocket:', error);
                socket.close();
            };

            setWs(socket);
        };

        connect();
    }, [token, attempts]);

    useEffect(() => {
        if (attempts > 0 && attempts < 5) { 
            const timeout = setTimeout(() => {
                setAttempts((prev) => prev + 1);
            }, Math.min(10000, 1000 * 2 ** attempts));
            return () => clearTimeout(timeout);
        }
    }, [attempts]);

    return (
        <WebSocketContext.Provider value={{ ws }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
