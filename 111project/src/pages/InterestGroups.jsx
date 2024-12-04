import React from "react";
import { useNavigate } from "react-router-dom";

function InterestGroups() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <table className="interestGroups-table">
                    <thead>
                        <tr>
                            <th>Interest Group Name</th>
                            <th>Interest Group Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default InterestGroups;