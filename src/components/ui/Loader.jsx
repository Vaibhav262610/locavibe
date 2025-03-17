// src/components/Loader.js

import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prevCount) => (prevCount + 1) % 4); // Cycles through 0, 1, 2, 3
        }, 300); // Update every 500ms for each dot

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    const dots = '.'.repeat(dotCount);

    return (
        <div className="flex justify-center flex-col items-center h-screen bg-[#121b22]/10">
            <img
                className="w-42 h-42 select-none    "
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMng0bjlnb3Z1Zmo1N3kxcmoyemw0M3MwNGs3amszemdjbjJtM2FydyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/6KKKVerzrhjRrClNKt/giphy.gif"
                alt="Loading..."
            />
            <p className="mt-4 nav font-thin text-3xl text-white">
                Loading{dots}
            </p>
        </div>
    );
};

export default Loader;
