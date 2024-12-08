import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Volunteer.css";

function Volunteer() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [userEmail, setUserEmail] = useState(""); // Assuming user email is tracked

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

    // Adds a volenteer to the database given the API in the backend.py
    const handleVolunteer = (eventName) => {
        fetch("http://127.0.0.1:5000/events/volunteer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "user@example.com", event_name: eventName }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert(data.message);
                    // Update the event list to reflect the new volunteer count
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.name === eventName
                                ? { ...event, numVolunteers: event.numVolunteers + 1 }
                                : event
                        )
                    );
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Error volunteering for event:", error));
    };
    // Unenrolls voulenteers given te API in backend.py
    const handleUnvolunteer = (eventName) => {
        fetch("http://127.0.0.1:5000/events/unvolunteer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "user@example.com", event_name: eventName }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert(data.message);
                    // Update the event list to reflect the new volunteer count
                    setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                            event.name === eventName
                                ? { ...event, numVolunteers: event.numVolunteers - 1 }
                                : event
                        )
                    );
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error("Error unvolunteering for event:", error));
    };

    return (
        <div>
            <div className="table-container">
                <table className="eventsForVolunteers-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Type</th>
                            <th>Number Volunteering</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* displays Voulenteer */}
                        {events.map((event, index) => (
                            <tr key={index}>
                                <td>{event.name}</td>
                                <td>{event.type}</td>
                                <td>{event.numVolunteers}</td>
                                <td>{event.address}</td>
                                <td>
                                    <button onClick={() => handleVolunteer(event.name)}>Click to Volunteer</button>
                                    <button onClick={() => handleUnvolunteer(event.name)}>Click to Un-Volunteer</button>
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