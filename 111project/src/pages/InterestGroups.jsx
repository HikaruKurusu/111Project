import React from "react";
import { useNavigate } from "react-router-dom";

function InterestGroups() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Table of Interest groups goes here</h2>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default InterestGroups;