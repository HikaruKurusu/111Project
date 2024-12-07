import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendGroups.css";

function FriendGroups() {
    const navigate = useNavigate();
    const [friendGroups, setFriendGroups] = useState([]);

    useEffect(() => {
        // Fetch friend groups from the Flask API
        fetch("http://127.0.0.1:5000/friend_groups")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setFriendGroups(data.friend_groups);
                } else {
                    console.error("Failed to fetch friend groups:", data.message);
                }
            })
            .catch((error) => console.error("Error fetching friend groups:", error));
    }, []);

    return (
        <div>
            <div className="table-container">
                
                <table className="friendGroups-table">
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <thead>
                        <tr>
                            <th>Friend Group Name</th>
                            <th>Number of Members</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {friendGroups.map((group, index) => (
                            <tr key={index}>
                                <td>{group.name}</td>
                                <td>{group.num_members}</td>
                                <td>
                                    <button onClick={() => alert(`Viewing details for ${group.name}`)}>
                                        Join Group
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}

export default FriendGroups;
