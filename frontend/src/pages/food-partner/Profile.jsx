import React, { useEffect, useState } from "react";
import "../../styles/profile.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


const Profile = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/food-partner/${id}`, {withCredentials: true})
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems)
            })
            .catch(error => {
                console.error("Failed to fetch food partner profile:", error);
                if (error.response?.status === 401) {
                    navigate("/user/login");
                }
            });

    }, [id, navigate])



  return (
    <div className="profile-page">
      <div className="profile-card">
        <header className="profile-topbar">
          <div  aria-label="Store logo">
            <img className="profile-avatar" src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
          </div>

          <div className="profile-meta">
            <div className="profile-name-pill">{profile?.restaurantName || profile?.fullname}</div>
            <div className="profile-address-pill">{profile?.address}</div>
          </div>
        </header>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">total meals</span>
            <strong className="stat-value">{profile?.totalMeals ?? videos.length}</strong>
          </div>

          <div className="stat-item">
            <span className="stat-label">customer serve</span>
            <strong className="stat-value">{profile?.totalCustomers}</strong>
          </div>
        </div>

        <section className="video-section">
          {videos.length > 0 ? (
            <div className="video-grid">
              {videos.map((item) => (
                <div className="video-tile" key={item._id}>
                  <video
                    src={item.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <span className="video-label">{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="video-empty">No videos yet</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;