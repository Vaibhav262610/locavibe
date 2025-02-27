"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            try {
                // Call the logout API to handle server-side logout
                const response = await fetch('/api/users/logout', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    // Delete token from localStorage
                    localStorage.removeItem('authToken');

                    // Delete token from cookies
                    document.cookie = 'authToken=; Max-Age=0; path=/;'; // This expires the cookie immediately

                    // Redirect to login page after logging out
                    router.push('/login');
                } else {
                    console.error('Logout failed');
                    // Optionally, you could show a message to the user if the API fails
                }
            } catch (error) {
                console.error('Error during logout:', error);
                // Optionally, you could show a message to the user if there's an error
            }
        };

        logout();
    }, [router]);

    return (
        <div className='flex w-full h-screen justify-center items-center text-4xl nav text-[#34D399]'>
            <h1>Logging out...</h1>
        </div>
    );
};

export default page;
