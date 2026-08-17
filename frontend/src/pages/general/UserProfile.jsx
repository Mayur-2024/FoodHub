import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/profile.css";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 10.8 12 4l8 6.8V18a2 2 0 0 1-2 2h-3.5v-6h-5v6H6a2 2 0 0 1-2-2v-7.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6Zm-6.2 7.3c.9-2.3 3.3-3.8 6.2-3.8s5.3 1.5 6.2 3.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/user/profile", { withCredentials: true })
      .then((response) => {
        setUser(response?.data?.user || null);
        setSavedItems(response?.data?.savedItems || []);
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
        setUser(null);
        setSavedItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/user/logout", { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/");
    }
  };

  return (
    <div className="user-profile-page">
      <div className="user-profile-card">
        <div className="profile-header">
          <div className="profile-avatar-circle">{user?.fullname?.charAt(0)?.toUpperCase() || "U"}</div>
          <div className="profile-user-meta">
            <h2>{user?.fullname || "User"}</h2>
            <p>{user?.email || "No email available"}</p>
          </div>
        </div>

        <div className="profile-summary">
          <div className="summary-box">
            <span className="summary-label">saved</span>
            <strong>{savedItems.length}</strong>
          </div>
          <div className="summary-box">
            <span className="summary-label">status</span>
            <strong>active</strong>
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <section className="saved-section">
          <h3>Saved Food Items</h3>

          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : savedItems.length > 0 ? (
            <div className="saved-grid">
              {savedItems.map((item) => (
                <div key={item._id} className="saved-item-card">
                  <video src={item.video} muted loop playsInline preload="metadata" />
                  <div className="saved-item-info">
                    <strong>{item.name}</strong>
                    <span>{item.description || "Fresh food item"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No saved food items yet.</p>
          )}
        </section>
      </div>

      <nav className="reels-bottom-nav" aria-label="Bottom navigation">
        <button type="button" className="nav-item" aria-label="Home" onClick={() => navigate("/")}>
          <HomeIcon />
          <span>home</span>
        </button>

        <button type="button" className="nav-item active" aria-label="Profile" onClick={() => navigate("/profile")}>
          <ProfileIcon />
          <span>profile</span>
        </button>
      </nav>
    </div>
  );
};

export default UserProfile;
