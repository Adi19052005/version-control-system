import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../../NavBar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:3002/userProfile/${userId}`
        );
        setUserDetails(response.data);
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  return (
    <>
      <Navbar />

      {/* Tabs */}
      <div className="profile-tabs">
        <button className="tab active">Overview</button>
        <button className="tab" onClick={() => navigate("/repo")}>
          Starred Repositories
        </button>
      </div>

      {/* Logout */}
      <button id="logout" onClick={handleLogout}>
        Logout
      </button>

      {/* Profile Layout */}
      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image" />

          <h3 className="username">{userDetails.username}</h3>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;
