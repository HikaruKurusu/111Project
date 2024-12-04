import React from "react";
import { useNavigate } from "react-router-dom";
import "./CommonStyles.css";

function Clubs() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="table-container">
                <table className="clubs-table">
                    <thead>
                        <tr>
                            <th>Club Name</th>
                            <th>Club Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default Clubs;