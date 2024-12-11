import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    // Login using backend.py API for login
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.status === "success") {
                setMessage("Login successful!");
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userName", data.user.name);
                // Redirect to the Dashboard page
                navigate("/dashboard", { state: { user: data.user } });
            } else {
                setMessage("Invalid email or password.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setMessage("An error occurred. Please try again.");
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
{message && <p>{message}</p>}
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;

