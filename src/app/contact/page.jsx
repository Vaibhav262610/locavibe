"use client"

import Navbar from '@/components/Navbar';
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const response = await fetch('https://formspree.io/f/mnnperbd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Your message has been sent!');
        form.reset();
      } else {
        alert('Oops, something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error sending message.');
    }
  };

  return (
    <>
    <div className="w-full flex justify-center items-center">
                <div className="w-full md:w-[65%]">
                    <Navbar />
                </div>
            </div>
    <section className="relative h-screen text-white flex  justify-center">
      <div className="absolute inset-0  opacity-50"></div>
      <div className="relative max-w-2xl w-full px-6 py-12 text-center z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
          Get In Touch With Us
        </h2>
        <p className="text-lg text-white mb-12">
          We would love to hear from you! Drop us a message below.
        </p>

        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-1">
              <input
                type="text"
                name="name"
                id="name"
                className="w-full p-6 rounded-lg bg-white text-gray-900 shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                />
            </div>
            <div className="flex-1">
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-6 rounded-lg bg-white text-gray-900 shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                />
            </div>
          </div>

          <div>
            <input
              type="text"
              name="subject"
              id="subject"
              className="w-full p-6 rounded-lg bg-white text-gray-900 shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              />
          </div>

          <div>
            <textarea
              name="message"
              id="message"
              className="w-full p-6 rounded-lg bg-white text-gray-900 shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              ></textarea>
          </div>

          <button
            type="submit"
            className="w-full p-6 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            >
            Send Message
          </button>
        </form>
      </div>
    </section>
              </>
  );
};

export default ContactPage;
