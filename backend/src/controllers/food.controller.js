const foodModel = require('../models/food.model.js');
const likeModel = require('../models/like.model.js');
const saveModel = require('../models/save.model.js');
const storageService = require('../services/storeage.services');
const {v4: uuid} = require('uuid');

async function createFood(req,res){
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Video file is required"
            });
        }

        const fileUploadReslt = await storageService.uploadFile(req.file.buffer, uuid());

        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: fileUploadReslt.url,
            foodPartner: req.foodPartner._id
        });
        
        res.status(201).json({
            message: "food created successfully",
            food: foodItem
        });
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({
            message: "Failed to upload video or create food item",
            error: error.message
        });
    }
}

async function getFoodItems(req,res){
    const foodItems = await foodModel.find({}).populate('foodPartner');
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    });
}

async function getLikedFoodIds(req, res) {
    const likedEntries = await likeModel.find({ user: req.user._id }).select('food');

    res.status(200).json({
        likedFoodIds: likedEntries.map((entry) => entry.food.toString())
    });
}

async function getSavedFoodIds(req, res) {
    const savedEntries = await saveModel.find({ user: req.user._id }).select('food');

    res.status(200).json({
        savedFoodIds: savedEntries.map((entry) => entry.food.toString())
    });
}

async function likeFood(req, res) {
    const {foodId} = req.body;
    const user = req.user;

    const food = await foodModel.findById(foodId);

    if (!food) {
        return res.status(404).json({
            message: "Food not found"
        });
    }

    const existingLike = await likeModel.findOne({
        user: user._id,
        food: foodId
    });

    if (existingLike) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { likeCount: -1 } },
            { new: true }
        );

        return res.status(200).json({
            message: "food unliked successfully",
            liked: false,
            likeCount: updatedFood.likeCount,
            food: updatedFood
        });
    }

    await likeModel.create({
        user: user._id,
        food: foodId
    });

    const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { likeCount: 1 } },
        { new: true }
    );

    return res.status(200).json({
        message: "food liked successfully",
        liked: true,
        likeCount: updatedFood.likeCount,
        food: updatedFood
    });
}

async function saveFood(req,res){
    const {foodId} = req.body;
    const user = req.user;

    const food = await foodModel.findById(foodId);

    if (!food) {
        return res.status(404).json({
            message: "Food not found"
        });
    }

    const existingSave = await saveModel.findOne({
        user: user._id,
        food: foodId
    });

    if (existingSave) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        });

        const updatedFood = await foodModel.findByIdAndUpdate(
            foodId,
            { $inc: { saveCount: -1 } },
            { new: true }
        );

        return res.status(200).json({
            message: "food unsaved successfully",
            saved: false,
            saveCount: updatedFood.saveCount,
            food: updatedFood
        });
    }

    await saveModel.create({
        user: user._id,
        food: foodId
    });

    const updatedFood = await foodModel.findByIdAndUpdate(
        foodId,
        { $inc: { saveCount: 1 } },
        { new: true }
    );

    return res.status(200).json({
        message: "food saved successfully",
        saved: true,
        saveCount: updatedFood.saveCount,
        food: updatedFood
    });
}


module.exports = {createFood,
    getFoodItems,
    getLikedFoodIds,
    getSavedFoodIds,
    likeFood,
    saveFood
}