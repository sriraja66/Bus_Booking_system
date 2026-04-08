import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
    return (
        <div className="page">
            <div className="hero">
                <h1>Welcome Back</h1>
                <p>Login to manage your bookings and explore new journeys</p>
            </div>

            <LoginForm />
        </div>
    );
}

export default LoginPage;

