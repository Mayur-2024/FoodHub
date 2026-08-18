const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');
const saveModel = require('../models/save.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const cookieOptions = {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
};

// User controllers
async function registerUser(req,res){

    const {fullname,email,password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({email});

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "user already exists"
        });
    }

    const hashPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullname,
        email,
        password: hashPassword
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname
        }
    })
}

async function loginUser(req,res){

    const {email, password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname
        }
    })

}

function logoutUser(req,res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({
        message: "User logged out successfully"
    });
}

async function getCurrentUserProfile(req,res){
    const user = await userModel.findById(req.user._id).lean();

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    const savedEntries = await saveModel.find({ user: user._id })
        .populate({
            path: 'food',
            populate: {
                path: 'foodPartner',
                model: 'FoodPartner'
            }
        })
        .lean();

    const mappedSavedItems = savedEntries
        .filter((entry) => entry.food)
        .map((entry) => ({
            _id: entry.food._id,
            name: entry.food.name,
            description: entry.food.description,
            video: entry.food.video,
            foodPartner: entry.food.foodPartner ? {
                _id: entry.food.foodPartner._id,
                fullname: entry.food.foodPartner.fullname,
                restaurantName: entry.food.foodPartner.restaurantName,
            } : null,
        }));

    res.status(200).json({
        message: "User profile fetched successfully",
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
        },
        savedItems: mappedSavedItems
    });
}

// Food-partner controllers
async function registerFoodPartner(req,res) {
    
    const {fullname, email, password, phone, address, restaurantName} = req.body;

    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({email});

    if(isFoodPartnerAlreadyExists){
        return res.status(400).json({
            message: "Food partner already exists"
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
        fullname,
        email,
        password: hashPassword,
        phone,
        address, 
        restaurantName
    });

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            fullname: foodPartner.fullname
        }
    });
    
}

async function loginFoodPartner(req,res){

    const {email,password} = req.body;

    const foodPartner = await foodPartnerModel.findOne({email})

    if(!foodPartner){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id
    }, process.env.JWT_SECRET);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            fullname: foodPartner.fullname
        }
    })

}

function logoutFoodPartner(req,res){
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({
        message: "Food partner logged out successfully"
    })
}

async function getCurrentFoodPartnerProfile(req, res) {
    const foodPartner = await foodPartnerModel.findById(req.foodPartner._id).lean();

    if (!foodPartner) {
        return res.status(404).json({
            message: "Food partner not found"
        });
    }

    const foodItems = await foodModel.find({ foodPartner: foodPartner._id }).lean();

    res.status(200).json({
        message: "Food partner profile fetched successfully",
        foodPartner: {
            ...foodPartner,
            totalMeals: foodItems.length,
            foodItems
        }
    });
}

module.exports = {
    registerUser, loginUser, logoutUser, getCurrentUserProfile,
    registerFoodPartner, loginFoodPartner, logoutFoodPartner, getCurrentFoodPartnerProfile
};