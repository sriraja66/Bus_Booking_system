import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Values match the DB enum exactly: 'user' | 'busUploader'
    const [loginRole, setLoginRole] = useState("user");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Send the role exactly as stored in the DB ('user' or 'busUploader')
            const data = await apiService.login({ email, password, role: loginRole });

            // Store user + token via AuthContext
            login(data.user, data.token);

            // Redirect based on the role that came back from the server
            if (data.user.role === 'busUploader') {
                navigate('/uploader/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            // err.status is set by apiService — show the right message per status
            if (err.status === 403) {
                setError("Incorrect login type. Please login with the correct role.");
            } else if (err.status === 401) {
                setError("Invalid email or password.");
            } else {
                setError(err.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: "450px", margin: "20px auto", padding: "30px" }}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Login to continue</h2>
            
            <div className="role-selector" style={{ display: 'flex', gap: '10px', marginBottom: '25px', justifyContent: 'center' }}>
                 <button
                    type="button"
                    onClick={() => setLoginRole("user")}
                    className={loginRole === "user" ? "search-btn" : "booking-btn"}
                    style={{ flex: 1, padding: '10px', fontSize: '14px' }}
                >
                    Login as User
                </button>
                <button
                    type="button"
                    onClick={() => setLoginRole("busUploader")}
                    className={loginRole === "busUploader" ? "search-btn" : "booking-btn"}
                    style={{ flex: 1, padding: '10px', fontSize: '14px' }}
                >
                    Login as Bus Uploader
                </button>
            </div>

            {error && (
                <div style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    fontSize: '14px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="input-group" style={{ marginBottom: "15px" }}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group" style={{ marginBottom: "20px" }}>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="search-btn" 
                    style={{ width: "100%", padding: '12px' }}
                    disabled={loading}
                >
                    {loading ? "Authenticating..." : `Login as ${loginRole === 'busUploader' ? 'Bus Uploader' : 'User'}`}
                </button>
            </form>

            <div style={{ marginTop: "25px", textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#64748b" }}>
                    Don't have an account? <br/>
                    <Link to="/signup">Register as User</Link> or <Link to="/uploader-signup">Register as Uploader</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
