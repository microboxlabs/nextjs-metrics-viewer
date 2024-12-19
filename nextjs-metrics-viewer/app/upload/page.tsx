"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Progress } from 'flowbite-react';
import { useSessionTimer } from "@/hooks/userSessionTimer";
import SessionTimeoutModal from "@/components/SessionTimeoutModal";

const UploadPage = () => {
    const { showModal, timeLeft, renewSession, logout } = useSessionTimer(); // Usa el hook para el modal
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user.role === 'admin') {
                        return; // Autorizado
                    } else {
                        router.push('/403');
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setMessage('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('No token found. Please log in again.');
            setIsUploading(false);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && e.total > 0) {
                const percentage = Math.round((e.loaded * 100) / e.total);
                setProgress(percentage);
            }
        });

        xhr.onload = () => {
            setIsUploading(false);
            if (xhr.status === 200) {
                setMessage('File uploaded successfully!');
                setIsRedirecting(true);
                setTimeout(() => {
                    router.push('/dashboard');
                }, 5000);
            } else {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    setMessage(`Error: ${errorData.message}`);
                } catch {
                    setMessage('An error occurred while uploading the file.');
                }
            }
        };

        xhr.onerror = () => {
            setIsUploading(false);
            setMessage('An error occurred while uploading the file.');
        };

        xhr.send(formData);
    };

    return (
        <div className="bg-quaternary-light container mx-auto my-10 rounded-lg p-6 shadow-lg">
            {/* Modal de expiración de sesión */}
            {showModal && (
                <SessionTimeoutModal
                    onRenew={renewSession}
                    onLogout={logout}
                />
            )}
            <h1 className="mb-6 text-center text-3xl font-bold text-primary">Upload CSV</h1>

            <div className="mb-6 flex flex-col items-center justify-center">
                <label
                    htmlFor="file-upload"
                    className="hover:bg-secondary-dark inline-block cursor-pointer rounded-lg bg-secondary px-6 py-3 text-center text-lg font-medium text-white shadow-md transition-all"
                >
                    Select CSV File
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {file && (
                    <p className="mt-2 text-sm text-gray-700">
                        Selected file: <span className="font-semibold">{file.name}</span>
                    </p>
                )}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3 text-lg font-semibold text-white shadow-md transition-all hover:scale-105 hover:opacity-90 ${isUploading ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>

            {isUploading && (
                <div className="my-6 flex flex-col items-center justify-center">
                    <Spinner size="lg" />
                    <div className="mt-4 w-full max-w-md">
                        <Progress progress={progress} />
                        <p className="mt-2 text-center">{progress}%</p>
                    </div>
                </div>
            )}

            {message && (
                <div
                    className={`mt-6 rounded-lg p-4 text-center ${message.includes("Error")
                        ? "border border-red-300 bg-red-100 text-red-700"
                        : "border border-green-300 bg-green-100 text-green-700"
                        }`}
                >
                    {message}
                    {/* Si el mensaje es de éxito y estamos redirigiendo, mostrar el spinner */}
                    {!message.includes("Error") && isRedirecting && (
                        <div className="mt-4 flex flex-col items-center">
                            <Spinner size="md" />
                            <p className="mt-2 text-sm text-gray-700">Redirigiendo al dashboard...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadPage;
