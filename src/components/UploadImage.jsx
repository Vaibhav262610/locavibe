"use client";

import { useState } from "react";

export default function UploadImage() {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an image!");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.imageUrl) {
                setImageUrl(data.imageUrl);
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {/* {imageUrl && <img src={imageUrl} alt="Uploaded" width="200" />} */}
        </div>
    );
}
