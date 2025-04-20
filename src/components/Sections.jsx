import React from 'react'
import CircularGallery from './ui/CircularGallery'

const Sections = () => {
    return (
        <>
            <div className='flex flex-col justify-center items-center w-full mt-20 mb-20  p-10 rounded-lg shadow-xl'>
                {/* Container with Centered Text */}
                <div className="flex justify-center items-center flex-col px-4 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-[#FFD9C4] to-green-600 font-bold animate-pulse">
                        Choose Your Vibe 😊
                    </h1>
                    <p className="mt-4 text-xl sm:text-2xl text-white opacity-80">
                        Discover your perfect vibe through our curated selection.
                    </p>
                </div>

                {/* Circular Gallery Container */}
                <div
                    className="relative w-full flex justify-center items-center mt-10"
                    style={{ height: '450px', minHeight: '70vh' }} // Adjusted height for better responsiveness
                >
                    <CircularGallery bend={0} textColor="#D0D0D0" borderRadius={0.05} />
                </div>
            </div>
        </>
    )
}

export default Sections
