// src/LoginPage.js
import React, { useState } from "react";
import "./LoginPage.css"; // We'll create this CSS file next
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();

        // Here you would handle the login logic (e.g., API request)
        if (email === "test@example.com" && password === "password123") {
            setMessage("Login successful!");
        } else {
            setMessage("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <button onClick={() => navigate('/dashboard')}>temp dashboard button</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;
