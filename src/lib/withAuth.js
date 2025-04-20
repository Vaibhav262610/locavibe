"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
    return function AuthComponent(props) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const token = Cookies.get("authToken");

            if (!token) {
                router.push("/login");
            } else {
                setIsAuthenticated(true);
            }
        }, []);

        return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
};

export default withAuth;
