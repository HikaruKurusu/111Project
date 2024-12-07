// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Volunteer from "./pages/Volunteer";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import FriendGroups from "./pages/FriendGroups";
import InterestGroups from "./pages/InterestGroups";
import RegisterEventPage from "./pages/registerEventPage";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/volunteer" element={<Volunteer />} />
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/friend-groups" element={<FriendGroups />} />
                    <Route path="/interest-groups" element={<InterestGroups />} />
                    <Route path="/registerEventPage" element={<RegisterEventPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;