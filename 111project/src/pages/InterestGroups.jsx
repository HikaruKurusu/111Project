import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InterestGroups.css";

function InterestGroups() {
    const navigate = useNavigate();
    const [interestGroups, setInterestGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({
        name: "",
        main_activity: "",
        num_members: 0,
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddGroup = () => {
        fetch("http://127.0.0.1:5000/interest_groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newGroup),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    // Refresh the interest groups list
                    setInterestGroups((prev) => [...prev, newGroup]);
                    alert("Interest group created successfully!");
                } else {
                    alert("Failed to create interest group: " + data.message);
                }
            })
            .catch((error) => alert("Error creating interest group: " + error));
    };

    const handleJoinInterestGroup = (groupName) => {
        fetch("http://127.0.0.1:5000/interest_groups/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ group_name: groupName, member_name: "Alice Jones" }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert(data.message);
                    // Update the interest group list to reflect the new member count
                    setInterestGroups((prevGroups) =>
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
            .catch((error) => console.error("Error joining interest group:", error));
    };

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
                                    <button onClick={() => handleJoinInterestGroup(group.name)}>Join Interest Group</button>
                                    <button className="details-button">Leave Interest Group</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add New Interest Group Section */}
            <div className="add-interest-group">
                <h2>Create New Interest Group</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddGroup();
                    }}
                >
                    <label>
                        Group Name:
                        <input
                            type="text"
                            name="name"
                            value={newGroup.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Main Activity:
                        <input
                            type="text"
                            name="main_activity"
                            value={newGroup.main_activity}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Number of Members:
                        <input
                            type="number"
                            name="num_members"
                            value={newGroup.num_members}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </label>
                    <button type="submit" className="add-button">
                        Add Interest Group
                    </button>
                </form>
            </div>

            <button className="dashboard-button" onClick={() => navigate("/dashboard")}>
                Dashboard
            </button>
        </div>
    );
}

export default InterestGroups;
