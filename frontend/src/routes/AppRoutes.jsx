import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import Landing from "../pages/general/Landing";
import Feed from "../pages/general/Feed";
import UserProfile from "../pages/general/UserProfile";
import Profile from "../pages/food-partner/Profile";
import CreateFood from "../pages/food-partner/CreateFoodPartner";
import FoodPartnerDashboard from "../pages/food-partner/FoodPartnerDashboard";

const AppRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element = {<Landing />}/>
                <Route path="/feed" element = {<Feed />}/>
                <Route path="/user/register" element = {<UserRegister />}/>
                <Route path="/user/login" element = {<UserLogin />}/>
                <Route path="/food-partner/register" element = {<FoodPartnerRegister />}/>
                <Route path="/food-partner/login" element = {<FoodPartnerLogin />}/>
                <Route path="/food-partner/dashboard" element = {<FoodPartnerDashboard />}/>
                <Route path="/food-partner-profile" element = {<FoodPartnerDashboard />}/>
                <Route path="/food-partner/:id" element = {<Profile />}/>
                <Route path="/profile" element = {<UserProfile />}/>
                <Route path="/create-food" element = {<CreateFood />}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes;