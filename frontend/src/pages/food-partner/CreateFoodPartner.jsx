import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

import "../../styles/create-food.css";

const CreateFood = () => {
  const [formData, setFormData] = useState({
    video: null,
    name: "",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, description, video } = formData;

    if (!name || !description || !video) {
      return;
    }

    const payload = new FormData();

    payload.append("name", name);
    payload.append("description", description);
    payload.append("video", video);

    try {
      await api.post("/api/food", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/food-partner/dashboard");
    } catch (error) {
      console.error("Food creation failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="create-food-page">
      <div className="create-food-card">
        <header className="create-food-header">
          <h1>Add Food</h1>
          <p>Share your new meal with customers.</p>
        </header>

        <form className="create-food-form" onSubmit={handleSubmit}>
          <div className="form-field file-upload">
            <label htmlFor="food-video">Video</label>
            <input
              id="food-video"
              name="video"
              type="file"
              accept="video/*"
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="food-name">Name</label>
            <input
              id="food-name"
              name="name"
              type="text"
              placeholder="Enter food name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="food-description">Description</label>
            <textarea
              id="food-description"
              name="description"
              placeholder="Write a short description..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Publish Food
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;