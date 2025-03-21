"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Page = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Account created successfully!");
                setTimeout(() => router.push("/login"), 1000);
            } else {
                toast.error(data.error || "Sign-up failed");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-3 bg-gray-900">
            <div className="w-full max-w-xs bg-white/10 backdrop-blur-lg p-5 rounded-lg shadow-lg border border-white/20">
                <h2 className="text-xl font-semibold text-center mb-3 text-white">Sign Up 🚀</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {[{ label: "Username", value: username, setValue: setUsername },
                    { label: "Email", value: email, setValue: setEmail, type: "email" },
                    { label: "Password", value: password, setValue: setPassword, type: "password" },
                    { label: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword, type: "password" }]
                        .map(({ label, value, setValue, type = "text" }, i) => (
                            <div key={i}>
                                <label className="block text-xs font-medium text-gray-300">{label}</label>
                                <input type={type} className="w-full p-2 bg-gray-800/50 text-white rounded border border-gray-600 focus:ring-2 focus:ring-teal-500 outline-none" value={value} onChange={(e) => setValue(e.target.value)} required />
                            </div>
                        ))}
                    <button type="submit" className={`w-full py-2 rounded text-white font-semibold flex justify-center transition-all ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"}`} disabled={loading}>
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-2">
                    Already have an account? <a href="/login" className="text-teal-400 hover:text-teal-500">Log in</a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Page;
