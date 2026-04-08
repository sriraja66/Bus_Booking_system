import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute component filters access based on authentication status and user roles.
 * 
 * @param {Array} allowedRoles - List of roles that are allowed to access this route
 * @param {React.Component} children - The component to render if authorized
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    // IMPORTANT: Use the normalized 'role' from useAuth() instead of manual extraction
    const { user, isAuthenticated, loading, role } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading-container">Loading authentication...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check against the normalized role provided by AuthContext
    if (allowedRoles && !allowedRoles.includes(role)) {
        // If unauthorized, redirect back to their own appropriate dashboard
        // busUploader and uploader are both normalized to 'busUploader' in AuthContext
        const dashboardPath = role === 'busUploader' ? '/uploader/dashboard' : '/dashboard';
        
        // Prevent redirect loop if they are already heading to their dashboard
        if (location.pathname === dashboardPath) {
            return children;
        }

        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
