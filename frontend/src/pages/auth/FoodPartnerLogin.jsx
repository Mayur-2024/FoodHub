import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

const FoodPartnerLogin = () => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await api.post(
      '/api/auth/foodpartner/login',
      formData,
      {withCredentials: true}
    );

    console.log("Login successful:", response.data);

    navigate("/food-partner/dashboard");
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Partner Portal</h1>
            <p>Sign in to manage your restaurant</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="you@restaurant.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <Link to="#" style={{ fontSize: '13px', color: 'var(--secondary-color)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-secondary">
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Not registered yet?{' '}
              <Link to="/food-partner/register">Register here</Link>
            </p>
            <p style={{ marginTop: '16px', fontSize: '12px' }}>
              Looking to order food?{' '}
              <Link to="/user/login">Sign in as user</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
