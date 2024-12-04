// src/Volunteer.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Volunteer() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <table className="eventsForVolunteers-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Volunteer;