import React from "react";
import { useNavigate } from "react-router-dom";


function FriendGroups() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Table of Friend groups goes here</h2>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default FriendGroups;