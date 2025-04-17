import React from 'react'

const page = () => {
  return (
    <div>
        <div className='text-white'>
            <h1>Get Started</h1>
            <h1>Welcome to LocaVibe - Find your vibe</h1>
            <div>
                <h1>Username</h1>
                <input type="text" />
            </div>
            <div>
                <h1>Email</h1>
                <input type="email" />
            </div>
            <div>
                <h1>Password</h1>
                <input type="password" />
            </div>
            <button>Sign up</button>
            <div>
                <h1>Already have an accont?</h1>
                <h1>Log in</h1>
            </div>
        </div>
        <div></div>
    </div>
  )
}

export default page