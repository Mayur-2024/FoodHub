import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/profile.css";

const FoodPartnerDashboard = () => {
  const navigate = useNavigate();
  const [foodPartner, setFoodPartner] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/foodpartner/profile", { withCredentials: true })
      .then((response) => {
        setFoodPartner(response.data.foodPartner);
        setVideos(response.data.foodPartner?.foodItems || []);
      })
      .catch((error) => {
        console.error("Failed to fetch food partner profile:", error);
        navigate("/food-partner/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/foodpartner/logout", { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/");
  };

  return (
    <div className="user-profile-page">
      <div className="user-profile-card">
        <div className="profile-header">
          <div className="profile-avatar-circle">
            {foodPartner?.restaurantName?.charAt(0)?.toUpperCase() || "R"}
          </div>
          <div className="profile-user-meta">
            <h2>{foodPartner?.restaurantName || "Restaurant Partner"}</h2>
            <p>Owner: {foodPartner?.fullname || "Partner Owner"}</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "2px" }}>{foodPartner?.email}</p>
          </div>
        </div>

        <div className="profile-summary">
          <div className="summary-box">
            <span className="summary-label">total meals</span>
            <strong>{videos.length}</strong>
          </div>
          <div className="summary-box">
            <span className="summary-label">phone</span>
            <strong style={{ fontSize: "0.9rem" }}>{foodPartner?.phone || "N/A"}</strong>
          </div>
        </div>

        <div className="profile-actions" style={{ display: "flex", gap: "10px" }}>
          <Link to="/create-food" className="logout-button" style={{ textAlign: "center", textDecoration: "none", background: "var(--primary-color, #ff6b35)" }}>
            + Add Food Item
          </Link>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="saved-section">
          <h3>Your Uploaded Meals</h3>

          {loading ? (
            <p className="empty-state">Loading your meals...</p>
          ) : videos.length > 0 ? (
            <div className="saved-grid">
              {videos.map((item) => (
                <div key={item._id} className="saved-item-card">
                  <video src={item.video} muted loop playsInline preload="metadata" />
                  <div className="saved-item-info">
                    <strong>{item.name}</strong>
                    <span>{item.description || "Uploaded food item"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p className="empty-state">No meals uploaded yet.</p>
              <Link to="/create-food" style={{ color: "#ff6b35", fontWeight: "bold" }}>
                Add your first meal
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FoodPartnerDashboard;
