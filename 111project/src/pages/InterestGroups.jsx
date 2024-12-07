import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InterestGroups.css";

function InterestGroups() {
    const navigate = useNavigate();
    const [interestGroups, setInterestGroups] = useState([]);

    useEffect(() => {
        // Fetch interest groups from the Flask API
        fetch("http://127.0.0.1:5000/interest_groups")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setInterestGroups(data.interest_groups);
                } else {
                    console.error("Failed to fetch interest groups:", data.message);
                }
            })
            .catch((error) => console.error("Error fetching interest groups:", error));
    }, []);

    return (
        <div className="interest-groups-container">
            <h1>Interest Groups</h1>
            <div className="table-container">
                <table className="interestGroups-table">
                    <thead>
                        <tr>
                            <th>Interest Group Name</th>
                            <th>Main Activity</th>
                            <th>Number of Members</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interestGroups.map((group, index) => (
                            <tr key={index}>
                                <td>{group.name}</td>
                                <td>{group.main_activity}</td>
                                <td>{group.num_members}</td>
                                <td>
                                    <button
                                        className="details-button"
                                        onClick={() => alert(`Viewing details for ${group.name}`)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="dashboard-button" onClick={() => navigate("/dashboard")}>
                Dashboard
            </button>
        </div>
    );
}

export default InterestGroups;
