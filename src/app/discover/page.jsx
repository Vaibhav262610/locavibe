"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const page = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div className="mt-32">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54872.0604246069!2d76.7295140993382!3d30.732347721742805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0be66ec96b%3A0xa5ff67f9527319fe!2sChandigarh!5e0!3m2!1sen!2sin!4v1741619504180!5m2!1sen!2sin"
                    width="600"
                    height="500"
                    style={{ border: 0 }}
                    className="w-full"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className='flex gap-4 text-[#FFD9C4] mt-12 w-full justify-center items-center'>
                    <div className="relative  cursor-pointer duration-200">
                        <button
                            onClick={toggleDropdown}
                            className="border border-white rounded-full px-14 py-3 flex cursor-pointer duration-200  items-center"
                        >
                            Chandigarh <ChevronDown className="ml-1" size={16} />
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute left-0 mt-2 w-full border rounded-md shadow-lg bg-white text-black cursor-pointer duration-200 z-10">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 1</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 2</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 3</li>
                            </ul>
                        )}
                    </div>

                    {/* <div className="flex items-center justify-center"> */}
                    <div className="flex items-center justify-center border  border-white pl-8 rounded-full shadow-md px-4 py-2">
                        <input
                            type="text"
                            placeholder="Search your vibe..."
                            className="w-[50rem] outline-none text-[#D0D0D0] text-lg placeholder:text-[#D0D0D0]"
                        />
                        {/* <button className="bg-green-400 cursor-pointer text-black font-semibold px-6 py-3 rounded-br-full rounded-tr-full rounded-bl-xl rounded-tl-xl">Search</button> */}
                    </div>
                    {/* </div> */}


                </div>
            </div>
        </>
    );
};

export default page;
