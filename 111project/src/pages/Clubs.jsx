import React from "react";
import { useNavigate } from "react-router-dom";

function Clubs() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Table of Clubs goes here</h2>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Clubs;