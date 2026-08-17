import React, { useEffect, useRef, useState } from "react";
import "../../styles/home.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20.5s-7.5-4.6-9.2-9.1C1.9 8.5 3.7 4.5 7.6 4.5c2.1 0 3.3 1.1 4.4 2.4 1.1-1.3 2.3-2.4 4.4-2.4 3.9 0 5.7 4 4.8 6.9-1.7 4.5-9.2 9.1-9.2 9.1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v13.8L12 16.5l-6.5 3.3V6A1.5 1.5 0 0 1 7 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 18.5 3.5 20V7.8A2.3 2.3 0 0 1 5.8 5.5h12.4A2.3 2.3 0 0 1 20.5 7.8v7.4a2.3 2.3 0 0 1-2.3 2.3H6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

const Feed = () => {
  const navigate = useNavigate();
  const reelsRef = useRef(null);
  const videoRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoFeeds, setVideoFeeds] = useState([]);
  const [savedFoodIds, setSavedFoodIds] = useState([]);
  const [likedFoodIds, setLikedFoodIds] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reelsContainer = reelsRef.current;

    if (!reelsContainer) {
      return undefined;
    }

    const handleScroll = () => {
      const slides = [...reelsContainer.children];
      const containerCenter = reelsContainer.scrollTop + reelsContainer.clientHeight / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetTop + slide.offsetHeight / 2;
        const distance = Math.abs(slideCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    reelsContainer.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => reelsContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index === activeIndex) {
        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {
          // autoplay may be blocked until interaction; ignore silently
        });
        return;
      }

      video.pause();
      video.currentTime = 0;
    });
  }, [activeIndex]);

  useEffect(() => {
    // Fetch public food videos (no auth required)
    axios
      .get("http://localhost:3000/api/food")
      .then((response) => {
        const items = response?.data?.foodItems || [];

        const mappedFeeds = items.map((item) => ({
          id: item._id || item.id,
          storeName: item.foodPartner?.restaurantName || item.foodPartner?.fullname || item.name || "Food Spot",
          foodName: item.name,
          description: item.description || "Fresh and delicious food waiting for you.",
          videoUrl: item.video,
          foodPartner: item.foodPartner?._id || item.foodPartner,
          likes: item.likeCount || 0,
          saves: item.saveCount || 0,
          comments: 0,
        }));

        setVideoFeeds(mappedFeeds);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch food videos:", error);
        setVideoFeeds([]);
        setLoading(false);
      });

    // Check if user is authenticated and fetch their liked/saved items
    axios
      .get("http://localhost:3000/api/food/liked", { withCredentials: true })
      .then((response) => {
        setLikedFoodIds(response?.data?.likedFoodIds || []);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setLikedFoodIds([]);
        setIsAuthenticated(false);
      });

    axios
      .get("http://localhost:3000/api/food/saved", { withCredentials: true })
      .then((response) => {
        setSavedFoodIds(response?.data?.savedFoodIds || []);
      })
      .catch(() => {
        setSavedFoodIds([]);
      });
  }, []);

  const handleActionToggle = async (type, foodId) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setLoginMessage(`Login to ${type} this video`);
      setShowAuthModal(true);
      return;
    }

    try {
      const endpoint = type === "like" ? "/api/food/like" : "/api/food/save";
      const response = await axios.post(
        `http://localhost:3000${endpoint}`,
        { foodId },
        { withCredentials: true }
      );

      if (type === "save") {
        const isSaved = !!response?.data?.saved;
        const nextSaveCount = response?.data?.saveCount ?? 0;
        setSavedFoodIds((current) =>
          isSaved ? [...new Set([...current, foodId])] : current.filter((id) => id !== foodId)
        );

        setVideoFeeds((current) =>
          current.map((feed) =>
            feed.id === foodId ? { ...feed, saves: nextSaveCount } : feed
          )
        );
      }

      if (type === "like") {
        const isLiked = !!response?.data?.liked;
        const nextLikeCount = response?.data?.likeCount ?? 0;
        setLikedFoodIds((current) =>
          isLiked ? [...new Set([...current, foodId])] : current.filter((id) => id !== foodId)
        );

        setVideoFeeds((current) =>
          current.map((feed) => {
            if (feed.id !== foodId) {
              return feed;
            }

            return { ...feed, likes: nextLikeCount };
          })
        );
      }
    } catch (error) {
      console.error(`Failed to ${type} food:`, error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setLoginMessage("Please login to perform this action");
        setShowAuthModal(true);
      }
    }
  };

  const handleVisitStore = (foodPartner) => {
    if (!isAuthenticated) {
      setLoginMessage("Please login to visit store");
      setShowAuthModal(true);
      return;
    }

    const partnerId = typeof foodPartner === "object" ? foodPartner?._id : foodPartner;
    if (partnerId) {
      navigate(`/food-partner/${partnerId}`);
    }
  };

  return (
    <div className="home-page">
      <div className="reels-container" ref={reelsRef}>
        {loading ? (
          <div className="no-videos-message">
            <p>Loading videos...</p>
          </div>
        ) : videoFeeds.length === 0 ? (
          <div className="no-videos-message">
            <p>No videos available yet. Check back soon!</p>
          </div>
        ) : (
          videoFeeds.map((feed, index) => (
            <section className="video-slide" key={feed.id}>
              <video
                ref={(node) => {
                  videoRefs.current[index] = node;
                }}
                className="video-background"
                src={feed.videoUrl}
                muted
                loop
                playsInline
                preload="auto"
                onCanPlay={() => {
                  if (index === activeIndex) {
                    videoRefs.current[index]?.play().catch(() => undefined);
                  }
                }}
              />

              <div className="video-gradient" />

              <div className="video-side-actions" aria-label="Video actions">
                <div className="action-item">
                  <button
                    type="button"
                    className={`action-button like-button ${likedFoodIds.includes(feed.id) ? "active" : ""}`}
                    aria-label="Like"
                    aria-pressed={likedFoodIds.includes(feed.id)}
                    onClick={() => handleActionToggle("like", feed.id)}
                    title={!isAuthenticated ? "Login to like" : ""}
                  >
                    <HeartIcon />
                  </button>
                  <span>{feed.likes}</span>
                </div>

                <div className="action-item">
                  <button
                    type="button"
                    className={`action-button save-button ${savedFoodIds.includes(feed.id) ? "active" : ""}`}
                    aria-label="Save"
                    aria-pressed={savedFoodIds.includes(feed.id)}
                    onClick={() => handleActionToggle("save", feed.id)}
                    title={!isAuthenticated ? "Login to save" : ""}
                  >
                    <BookmarkIcon />
                  </button>
                  <span>{feed.saves}</span>
                </div>

                <div className="action-item">
                  <button type="button" className="action-button" aria-label="Comments">
                    <CommentIcon />
                  </button>
                  <span>{feed.comments}</span>
                </div>
              </div>

              <div className="video-content">
                <div className="video-text-block">
                  <p className="video-store-name">{feed.storeName}</p>
                  <p className="video-description">{feed.description}</p>
                </div>

                <button
                  onClick={() => handleVisitStore(feed.foodPartner)}
                  className="visit-store-btn"
                >
                  visit store
                </button>
              </div>
            </section>
          ))
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Login Required</h2>
            <p>{loginMessage}</p>
            <div className="auth-modal-buttons">
              <Link to="/user/login" className="modal-btn btn-primary">
                Login
              </Link>
              <Link to="/user/register" className="modal-btn btn-secondary">
                Sign Up
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                className="modal-btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="reels-bottom-nav" aria-label="Bottom navigation">
        <button type="button" className="nav-item active" aria-label="Home" onClick={() => navigate("/feed")}>
          <HomeIcon />
          <span>home</span>
        </button>

        {isAuthenticated && (
          <button type="button" className="nav-item" aria-label="Profile" onClick={() => navigate("/profile")}>
            <ProfileIcon />
            <span>profile</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default Feed;

