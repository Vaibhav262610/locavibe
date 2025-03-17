"use client";

import { useState, useEffect } from "react";

export default function ImageGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const res = await fetch(
                `https://res.cloudinary.com/${cloudName}/image/list/nextjs_uploads.json`
            );
            const data = await res.json();
            setImages(data.resources || []);
        };
        fetchImages();
    }, []);

    return (
        <div>
            <h2>Uploaded Images</h2>
            {images.map((img, index) => (
                <img key={index} src={img.secure_url} alt="Uploaded" width="200" />
            ))}
        </div>
    );
}
