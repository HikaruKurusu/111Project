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
                                <td>{club.name}</td>
                                <td>{club.address}</td>
                                <td>{club.meeting_times}</td>
                                <td>{club.num_members}</td>
                                <td>
                                    <button>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
