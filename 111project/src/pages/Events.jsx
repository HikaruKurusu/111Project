import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";

function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({
        name: "",
        type: "",
        num_attending: 0,
        address: "",
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add the event using the Flask API
        fetch("http://127.0.0.1:5000/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("Event added successfully!");
                    setForm({ name: "", type: "", num_attending: 0, address: "" });
                    // Fetch updated list of events
                    fetch("http://127.0.0.1:5000/events")
                        .then((response) => response.json())
                        .then((data) => setEvents(data.events));
                } else {
                    alert("Failed to add event: " + data.message);
                }
            })
            .catch((error) => console.error("Error adding event:", error));
    };

    return (
        <div>
            <div className="form-container">
                <h2>Add New Event</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Event Name"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Event Type"
                        value={form.type}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="num_attending"
                        placeholder="Number Attending"
                        value={form.num_attending}
                        onChange={handleInputChange}
                        min="0"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Event Address"
                        value={form.address}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Event</button>
                </form>
            </div>

            <div className="table-container">
                {/* <h2>Events List</h2> */}
                <table className="events-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Type</th>
                            <th>Number Attending</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={index}>
                                <td>{event.name}</td>
                                <td>{event.type}</td>
                                <td>{event.num_attending}</td>
                                <td>{event.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Events;
