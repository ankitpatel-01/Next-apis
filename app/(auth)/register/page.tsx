"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const checkUsernameAvailability = async (username: string) => {
        if (!username) return;

        const response = await fetch(`/api/users/check-username?username=${username}`);
        const data = await response.json();
        setUsernameAvailable(data.available);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            checkUsernameAvailability(username);
        }, 500); // Debounce for 500ms

        return () => {
            clearTimeout(handler);
        };
    }, [username]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log(response);
            // Redirect to login page after successful registration
            router.push('/login');
        } else {
            setError(data.message || "Error in registration");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleRegister} className="w-1/3 bg-white p-6 rounded shadow-md">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={`w-full p-2 border ${usernameAvailable ? 'border-gray-300' : 'border-red-500'} rounded`}
                    />
                    {!usernameAvailable && <p className="text-red-500 text-sm">Username is not available</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    disabled={!usernameAvailable}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
