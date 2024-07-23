'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DashboardHome = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await fetch('/api/userInfo');
            if (res.status === 200) {
                const data = await res.json();
                setUsername(data.username);
            } else {
                router.push('/login');
            }
            setLoading(false); // Set loading to false after fetching
        };

        fetchUserInfo();
    }, [router]);

    const handleLogout = async () => {
        // Clear the cookie by setting it to an expired date
        document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/login');
    };

    const handleNavigateToNotes = () => {
        router.push('/notes');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-4">Welcome, {username}!</p>
            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
                Logout
            </button>
            <button
                onClick={handleNavigateToNotes}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Go to Notes
            </button>
        </div>
    );
};

export default DashboardHome;
