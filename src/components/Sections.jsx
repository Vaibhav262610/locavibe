import React from 'react'
import CircularGallery from './ui/CircularGallery'
// import CircularGallery from './CircularGallery'

const Sections = () => {
    return (
        <>
            <div className='flex justify-center items-center flex-col'>
                <div>
                    <h1 className='text-5xl text-[#D0D0D0] font-bold'>Choose Your Vibe 😊</h1>
                </div>
            </div>
            <div style={{ height: '600px', position: 'relative' }}>
                <CircularGallery bend={0} textColor="#D0D0D0" borderRadius={0.05} />
            </div>
        </>
    )
}

export default Sections