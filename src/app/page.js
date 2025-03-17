"use client"

import Header from '@/components/Header'
// import Navbar from '@/components/Navbar'
import Sections from '@/components/Sections'
import Loader from '@/components/ui/Loader'
import Why from '@/components/Why'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Simulating an async operation, e.g., fetching data
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after 3 seconds
    }, 3000); // Adjust the delay as needed
  }, []);

  if (isLoading) {
    return <Loader />;
  }
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

export default Home