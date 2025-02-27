"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
    return function AuthComponent(props) {
        const router = useRouter();

        // Check for both 'token' and 'authToken' in localStorage
        const token = typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("authToken")
            : null;

        useEffect(() => {
            // If no token is found, redirect to the login page
            if (!token) {
                router.push("/login");
            }
        }, [token]);

        // Render the wrapped component if authenticated
        return token ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuth;
