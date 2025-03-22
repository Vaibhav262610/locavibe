import React from 'react'
import CircularGallery from './ui/CircularGallery'

const Sections = () => {
    return (
        <>
            {/* Container with Centered Text */}
            <div className="flex justify-center items-center flex-col px-4 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#D0D0D0] font-bold">
                    Choose Your Vibe 😊
                </h1>
            </div>

            {/* Circular Gallery Container */}
            <div
                className="relative w-full"
                style={{ height: '400px', minHeight: '60vh' }} // Adjusted height for better responsiveness
            >
                <CircularGallery bend={0} textColor="#D0D0D0" borderRadius={0.05} />
            </div>
        </>
    )
}

export default Sections
