"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.token) {
          toast.error("Login failed: No token received");
          setLoading(false);
          return;
        }

        localStorage.setItem("authToken", data.token);
        document.cookie = `authToken=${data.token}; path=/; max-age=1800; Secure; SameSite=Strict`;
        toast.success("Login successful!");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(data.error || "User Already Logged In");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Please login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold flex justify-center items-center transition-all text-base ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 transform hover:scale-[1.03]"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-teal-400 hover:text-teal-500 underline transition"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Page;
