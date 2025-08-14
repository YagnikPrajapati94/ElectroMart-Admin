import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = ({ children, requiredRole }) => {
    const [checking, setChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("adminToken");
        if (!token) {
            setIsAuthorized(false);
            setChecking(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            // console.log("Decoded token:", decoded); // ✅ Add this for debug

            const now = Date.now() / 1000;

            if (decoded.exp < now) {
                console.warn("Token expired");
                setIsAuthorized(false);
            } else if (
                requiredRole &&
                decoded.user &&
                decoded.user.role !== requiredRole
            ) {
                console.warn("Role mismatch");
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
        } catch (err) {
            console.error("Invalid token", err);
            setIsAuthorized(false);
        } finally {
            setChecking(false);
        }
    }, [requiredRole]);

    if (checking) return <div>Checking credentials...</div>;

    return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
