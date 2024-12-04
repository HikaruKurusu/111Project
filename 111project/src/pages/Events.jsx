import React from "react";
import { useNavigate } from "react-router-dom";

function Events() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <table className="events-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Description</th>
                            <th>Affiliated Organizations</th>
                            <th>Popular with</th>
                            <th>Friends Attending</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Events;