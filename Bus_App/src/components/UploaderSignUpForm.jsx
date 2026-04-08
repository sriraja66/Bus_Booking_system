import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";

function UploaderSignUpForm() {
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        contactNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await apiService.register({ 
                username: formData.companyName, 
                email: formData.email, 
                password: formData.password,
                role: 'busUploader'
            });
            
            alert("Uploader registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: "500px", margin: "20px auto", padding: "30px" }}>
            <h2>Bus Partner Sign Up</h2>

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleSignUp}>
                <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Company/Bus Name</label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Enter company name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter company email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Contact Number (Optional)</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        placeholder="Enter contact number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-group" style={{ marginBottom: "20px" }}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="search-btn" 
                    style={{ width: "100%", backgroundColor: "#3498db" }}
                    disabled={loading}
                >
                    {loading ? "Creating partner account..." : "Join as Service Provider"}
                </button>
            </form>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#64748b" }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default UploaderSignUpForm;
