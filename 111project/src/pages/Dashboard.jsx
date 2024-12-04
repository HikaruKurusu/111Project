// src/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Welcome to the Dashboard</h2>
            <p>You are logged in!</p>
            <div>
                <button onClick={() => navigate("/volunteer")}>Volunteer</button>
                <button onClick={() => navigate("/clubs")}>Clubs</button>
                <button onClick={() => navigate("/events")}>Events</button>
                <button onClick={() => navigate("/friend-groups")}>Friend Groups</button>
                <button onClick={() => navigate("/interest-groups")}>Interest Groups</button>
            </div>
        </div>
    );
}

export default Dashboard;