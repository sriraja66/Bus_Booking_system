import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginRole, setLoginRole] = useState("user"); // "user" or "uploader" (DB roles)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Map UI role to the DB-native role before sending to backend
            const dbRole = loginRole === "busUploader" ? "uploader" : loginRole;
            const data = await apiService.login({ email, password, role: dbRole });
            
            // Log in via AuthContext (stores user/token in storage and state)
            login(data.user, data.token);

            console.log("Login successful:", data.user?.username || data.user?.name);
            
            // Redirect based on the normalized role (AuthContext maps 'uploader' -> 'busUploader')
            const normalizedRole = data.user.role === 'uploader' ? 'busUploader' : data.user.role;
            if (normalizedRole === 'busUploader') {
                navigate('/uploader/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            // The backend returns a 403 for role mismatches
            setError(err.message || "Invalid credentials");
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
                    onClick={() => setLoginRole("uploader")}
                    className={loginRole === "uploader" ? "search-btn" : "booking-btn"}
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
                    {loading ? "Authenticating..." : `Login as ${loginRole === 'user' ? 'User' : 'Uploader'}`}
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
