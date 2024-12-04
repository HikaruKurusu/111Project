// src/Volunteer.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Volunteer() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Table of Events goes here</h2>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Volunteer;