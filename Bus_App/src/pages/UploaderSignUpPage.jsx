import React from "react";
import UploaderSignUpForm from "../components/UploaderSignUpForm";

function UploaderSignUpPage() {
    return (
        <div className="page">
            <div className="hero">
                <h1>Partner with Us</h1>
                <p>Register your bus service and reach thousands of passengers daily</p>
            </div>

            <UploaderSignUpForm />
        </div>
    );
}

export default UploaderSignUpPage;

