import React from "react";
import SignUpForm from "../components/SignUpForm";

function SignUpPage() {
    return (
        <div className="page">
            <div className="hero">
                <h1>Join Us Today</h1>
                <p>Create an account to start booking your bus tickets with ease</p>
            </div>

            <SignUpForm />
        </div>
    );
}

export default SignUpPage;

