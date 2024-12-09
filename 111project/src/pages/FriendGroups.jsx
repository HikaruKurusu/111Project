import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendGroups.css";

function FriendGroups() {
    const navigate = useNavigate();
    const [friendGroups, setFriendGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [userName, setUserName] = useState("John Doe"); // Assuming user name is tracked

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
 // creates friend groups from the Flask API
    const createFriendGroup = () => {
        fetch("http://127.0.0.1:5000/friend_groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newGroupName }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setFriendGroups([...friendGroups, { name: newGroupName, num_members: 0 }]);
                    setNewGroupName(""); // Clear the input
                } else {
                    console.error("Failed to create friend group:", data.message);
                }
            })
            .catch((error) => console.error("Error creating friend group:", error));
    };
    // uses the join friend group API
    const handleJoinFriendGroup = (groupName) => {
        fetch("http://127.0.0.1:5000/friend_groups/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_name: groupName, member_name: "TESTUSER" }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert(data.message);
                    // Update the friend group list to reflect the new member count
                    setFriendGroups((prevGroups) =>
                        prevGroups.map((group) =>
                            group.name === groupName
                                ? { ...group, num_members: group.num_members + 1 }
                                : group
                        )
                    );
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Error joining friend group:", error));
    };

    return (
        <div>
            <div className="table-container">
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                <table className="friendGroups-table">
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
                                    <button onClick={() => handleJoinFriendGroup(group.name)}>Join Group</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="create-group">
                <h3>Create a New Friend Group</h3>
                <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group Name"
                />
                <button onClick={createFriendGroup}>Create Group</button>
            </div>
        </div>
    );
}

export default FriendGroups;