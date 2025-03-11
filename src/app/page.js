import Header from '@/components/Header'
// import Navbar from '@/components/Navbar'
import Sections from '@/components/Sections'
import Why from '@/components/Why'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='w-full flex justify-center items-center '>
        <div className='w-[60%]'>
          {/* <Navbar /> */}
          <Header />
          <Sections />
          {/* <Header /> */}
          <Why />
        </div>
      </div>
    </>
  )
}

export default page