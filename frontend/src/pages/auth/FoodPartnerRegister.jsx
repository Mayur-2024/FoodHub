import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';


const FoodPartnerRegister = () => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    agreeTerms: false,
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

    try{

      const response = await api.post(
        '/api/auth/foodpartner/register',
        {...formData,
          fullname: formData.ownerName
        },
        {
          withCredentials: true
        }
      )

      console.log(response.data);

      navigate("/food-partner/dashboard");

    }catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Join as Food Partner</h1>
            <p>Register your restaurant and reach more customers</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="restaurantName">Restaurant Name</label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                className="form-input"
                placeholder="Your restaurant name"
                value={formData.restaurantName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerName">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                className="form-input"
                placeholder="Full name"
                value={formData.ownerName}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                placeholder="123 Main Street"
                value={formData.address}
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
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">
                I agree to the Restaurant Partner Agreement and Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn btn-secondary">
              Register Restaurant
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already registered?{' '}
              <Link to="/food-partner/login">Sign In</Link>
            </p>
            <p style={{ marginTop: '16px', fontSize: '12px' }}>
              Want to register as a regular user?{' '}
              <Link to="/user/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
