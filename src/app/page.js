import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='w-full flex justify-center items-center '>
        <div className='w-[60%]'>
          <Navbar />
          <Header />
        </div>
      </div>
    </>
  )
}

export default page