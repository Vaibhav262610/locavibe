"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        imageUrl: '',
        rating: '',
        reviews: '',
        description: '',
        categories: '',
        priceRange: '',
        openingHours: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const adminEmailId = "vaibhav@gmail.com";
    const adminUserName = "vaibhav";

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch("/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Invalid or expired token");
                }

                const data = await response.json();
                if (data?.data?.username === adminUserName && data?.data?.email === adminEmailId) {
                    setIsAdmin(true);
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error verifying admin:", error);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (isLoading) {
        return <div className='h-screen w-full flex justify-center items-center'><h1 className='text-3xl text-green-400'>Checking Admin Credentials...</h1></div>;
    }

    if (!isAdmin) {
        return <div className='h-screen w-full flex justify-center items-center'><h1 className='text-3xl text-red-500'>Access Denied</h1></div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/restaurant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    rating: Number(formData.rating),
                    reviews: Number(formData.reviews),
                    categories: formData.categories.split(',').map(c => c.trim()),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Restaurant added successfully!');
                setFormData({ name: '', location: '', imageUrl: '', rating: '', reviews: '', description: '', categories: '', priceRange: '', openingHours: '' });
            } else {
                setMessage(`Upload failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            setMessage('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen w-full flex justify-center items-center'>
            <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Add Restaurant</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Restaurant Name" className="w-full p-2 border rounded" onChange={handleChange} value={formData.name} required />
                    <input type="text" name="location" placeholder="Location" className="w-full p-2 border rounded" onChange={handleChange} value={formData.location} required />
                    <input type="text" name="imageUrl" placeholder="Image URL" className="w-full p-2 border rounded" onChange={handleChange} value={formData.imageUrl} required />
                    <input type="number" name="rating" placeholder="Rating (1-5)" className="w-full p-2 border rounded" onChange={handleChange} value={formData.rating} required />
                    <input type="number" name="reviews" placeholder="Number of Reviews" className="w-full p-2 border rounded" onChange={handleChange} value={formData.reviews} required />
                    <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" onChange={handleChange} value={formData.description} required />
                    <input type="text" name="categories" placeholder="Categories (comma separated)" className="w-full p-2 border rounded" onChange={handleChange} value={formData.categories} required />
                    <input type="text" name="priceRange" placeholder="Price Range" className="w-full p-2 border rounded" onChange={handleChange} value={formData.priceRange} required />
                    <input type="text" name="openingHours" placeholder="Opening Hours" className="w-full p-2 border rounded" onChange={handleChange} value={formData.openingHours} required />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded" disabled={loading}>
                        {loading ? 'Uploading...' : 'Submit'}
                    </button>
                </form>
                {message && <p className="mt-2 text-center text-sm">{message}</p>}
            </div>
        </div>
    );
};

export default Page;
