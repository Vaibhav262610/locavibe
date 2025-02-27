import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <div>
            <div className=' bg-[#121b22] text-[#FFD9C4] w-full left-0  justify-evenly z-50 fixed top-0 items-center flex  py-7 px-34 '>
                <Link href='/'>
                    <h1 className=' font-black text-4xl'>Loca<span className='text-[#33e0a1]'>vibe</span>.</h1>
                </Link>
                <div className='flex text-[#D0D0D0] text-lg gap-10'>
                    <h2 className='hover:opacity-70 duration-200 cursor-pointer'>Discover</h2>
                    <h2 className='hover:opacity-70 duration-200 cursor-pointer'>Trips</h2>
                    <h2 className='hover:opacity-70 duration-200 cursor-pointer'>Review</h2>
                    <h2 className='hover:opacity-70 duration-200 cursor-pointer'>Forums</h2>
                </div>
                <div>
                    <button className='border border-[#FFD9C4] text-white rounded-lg text-lg py-2   cursor-pointer hover:bg-[#FFD9C4] hover:text-black font-semibold duration-200 px-7'>Sign In</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar