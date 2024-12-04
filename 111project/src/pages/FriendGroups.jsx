import React from "react";
import { useNavigate } from "react-router-dom";


function FriendGroups() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <table className="friendGroups-table">
                    <thead>
                        <tr>
                            <th>Friend Group Name</th>
                            <th>Friend Group Members</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
    );
}

export default FriendGroups;