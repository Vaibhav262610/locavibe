"use client"

import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Sections from '@/components/Sections'
import Why from '@/components/Why'
import React from 'react'

const Home = () => {
  return (
    <>
      <div className='w-full flex justify-center items-center '>
        <div className='w-full md:w-[60%]'>
          <Header />
          <Sections />
          <Why />
        </div>
      </div>
    </>
  )
}

export default Home