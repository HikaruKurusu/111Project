import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterEventPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [attendees, setAttendees] = useState([]);  // New state for attendees
    const navigate = useNavigate();

    // Fetch events on mount
    useEffect(() => {
        fetch("http://127.0.0.1:5000/events")  // Adjust URL if needed
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setEvents(data.events);
                } else {
                    setMessage("Error fetching events");
                }
            })
            .catch(() => setMessage("Error fetching events"));
    }, []);

    // Fetch event attendees when an event is selected
    useEffect(() => {
        if (selectedEvent) {
            fetch(`http://127.0.0.1:5000/events/attendees?event_name=${selectedEvent}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        setAttendees(data.attendees);
                    } else {
                        setAttendees([]);  // Clear attendees if none found
                    }
                })
                .catch(() => setMessage("Error fetching event attendees"));
        }
    }, [selectedEvent]);
    // Registers for event given the API in backend.py
    const handleRegister = async () => {
        if (!email || !selectedEvent) {
            setMessage("Please provide both email and select an event");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/events/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    event_name: selectedEvent
                })
            });
            
            const data = await response.json();
            console.log(data); // Log the response to the console for debugging
    
            if (data.status === "success") {
                setMessage("Successfully registered for the event!");
                // Add your email to the list of attendees
                setAttendees(prevAttendees => [...prevAttendees, email]);
            } else {
                setMessage(data.message || "Error registering for event");
            }
        } catch (error) {
            console.error("API Error:", error); // Log the error if the API call fails
            setMessage("Error registering for event");
        }
    };

    return (
        <div>
            <h2>Register for Event</h2>
            <div>
                <label>Email: </label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                />
            </div>
            <div>
                <label>Choose an Event: </label>
                <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
                    <option value="">Select Event</option>
                    {events.map((event) => (
                        <option key={event.name} value={event.name}>
                            {event.name} - {event.type}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleRegister}>Register</button>
            <button onClick = {() => navigate("/events")}>Back to Events</button>
            {message && <p>{message}</p>}

            {selectedEvent && (
                <div>
                    <h3>Attendees for {selectedEvent}:</h3>
                    {attendees.length > 0 ? (
                        <table border="1" cellPadding="10">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Attendee Email</th>
                                </tr>
                            </thead>
                            {/* Displays them in table */}
                            <tbody>
                                {attendees.map((attendee, index) => (
                                    <tr key={index}>
                                        <td>{selectedEvent}</td>
                                        <td>{attendee}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No attendees for this event yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default RegisterEventPage;
