import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Clubs.css";

function Clubs() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [newClub, setNewClub] = useState({
        name: "",
        address: "",
        meeting_times: "",
        num_members: 0,
    });
    const [selectedClub, setSelectedClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [noMembersFound, setNoMembersFound] = useState(false);
    const [userName, setUserName] = useState("John Doe"); // Assuming user name is tracked

    useEffect(() => {
        // Fetch clubs from the Flask API
        fetch("http://127.0.0.1:5000/clubs")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setClubs(data.clubs);
                } else {
                    console.error("Failed to fetch clubs:", data.message);
                }
            })
            .catch((error) => console.error("Error fetching clubs:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClub((prev) => ({ ...prev, [name]: value }));
    };
    // adds club based on backend.py API
    const handleAddClub = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:5000/clubs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newClub),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setClubs((prev) => [...prev, newClub]);
                    setNewClub({ name: "", address: "", meeting_times: "", num_members: 0 });
                } else {
                    console.error("Failed to add club:", data.message);
                }
            })
            .catch((error) => console.error("Error adding club:", error));
    };
    // View club table based on backend.py API
    const handleViewDetails = (clubName) => {
        fetch(`http://127.0.0.1:5000/clubs/members?club_name=${clubName}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setSelectedClub(clubName);
                    setMembers(data.members);
                    setNoMembersFound(data.members.length === 0);
                } else {
                    console.error("Failed to fetch members:", data.message);
                    setNoMembersFound(true);
                }
            })
            .catch((error) => {
                console.error("Error fetching members:", error);
                setNoMembersFound(true);
            });
    };
// Handles joining club based on backend.py API
    const handleJoinClub = (clubName) => {
        fetch("http://127.0.0.1:5000/clubs/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ club_name: clubName, member_name: 'TESTUSER' }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert(data.message);
                    // Update the club list to reflect the new member count
                    setClubs((prevClubs) =>
                        prevClubs.map((club) =>
                            club.name === clubName
                                ? { ...club, num_members: club.num_members + 1 }
                                : club
                        )
                    );
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Error joining club:", error));
    };

    return (
        <div>
            <div className="table-container">
                <table className="clubs-table">
                    <thead>
                        <tr>
                            <th>Club Name</th>
                            <th>Address</th>
                            <th>Meeting Times</th>
                            <th>Number of Members</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map((club, index) => (
                            <tr key={index}>
                                {/* Displays in a table */}
                                <td>{club.name}</td>
                                <td>{club.address}</td>
                                <td>{club.meeting_times}</td>
                                <td>{club.num_members}</td>
                                <td>
                                    <button onClick={() => handleViewDetails(club.name)}>View Details</button>
                                    <button onClick={() => handleJoinClub(club.name)}>Join Club</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedClub && (
                <div className="members-container">
                    <h2>Members of {selectedClub}</h2>
                    {noMembersFound ? (
                        <p>No members found for this club.</p>
                    ) : (
                        <table className="members-table">
                            <thead>
                                <tr>
                                    <th>Member Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index) => (
                                    <tr key={index}>
                                        <td>{member}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {/* inputs */}
            <form onSubmit={handleAddClub} className="add-club-form">
                <h2>Add a New Club</h2>
                <input
                    type="text"
                    name="name"
                    value={newClub.name}
                    onChange={handleInputChange}
                    placeholder="Club Name"
                    required
                />
                <input
                    type="text"
                    name="address"
                    value={newClub.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                />
                <input
                    type="text"
                    name="meeting_times"
                    value={newClub.meeting_times}
                    onChange={handleInputChange}
                    placeholder="Meeting Times"
                    required
                />
                <input
                    type="number"
                    name="num_members"
                    value={newClub.num_members}
                    onChange={handleInputChange}
                    placeholder="Number of Members"
                    min="0"
                />
                <button type="submit">Add Club</button>
            </form>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Clubs;