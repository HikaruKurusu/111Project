import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Volunteer.css";

function Volunteer() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    //test

    useEffect(() => {
        // Fetch events from the Flask API
        fetch("http://127.0.0.1:5000/events")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setEvents(data.events);
                } else {
                    console.error("Failed to fetch events:", data.message);
                }
            })
            .catch((error) => console.error("Error fetching events:", error));
    }, []);

    return (
        <div>
            <div className="table-container">
                <table className="eventsForVolunteers-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Type</th>
                            <th>Number Attending</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={index}>
                                <td>{event.name}</td>
                                <td>{event.type}</td>
                                <td>{event.num_attending}</td>
                                <td>{event.address}</td>
                                <td>
                                    <button>Click to Volunteer</button>
                                    <button>Click to Un-Volunteer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Volunteer;
