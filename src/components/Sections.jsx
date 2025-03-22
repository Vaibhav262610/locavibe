import React from 'react'
import CircularGallery from './ui/CircularGallery'

const Sections = () => {
    return (
        <>
            <div className='flex flex-col justify-center items-center w-full mt-40 mb-20'>
                {/* Container with Centered Text */}
                <div className="flex justify-center items-center flex-col px-4 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#D0D0D0] font-bold">
                        Choose Your Vibe 😊
                    </h1>
                </div>

                {/* Circular Gallery Container */}
                <div
                    className="relative w-full flex justify-center items-center"
                    style={{ height: '400px', minHeight: '60vh' }} // Adjusted height for better responsiveness
                >
                    <CircularGallery bend={0} textColor="#D0D0D0" borderRadius={0.05} />
                </div>
            </div>
        </>
    )
}

export default Sections
