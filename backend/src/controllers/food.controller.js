const foodModel = require('../models/food.model.js');
const likeModel = require('../models/like.model.js');
const saveModel = require('../models/save.model.js');
const storageService = require('../services/storeage.services');
const {v4: uuid} = require('uuid');

async function createFood(req,res){
    try {
        if (!req.foodPartner?._id) {
            return res.status(401).json({
                message: "Please login as a food partner first"
            });
        }

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
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                message: "Unauthorized",
                likedFoodIds: []
            });
        }

        const likedEntries = await likeModel.find({ user: req.user._id }).select('food');

        res.status(200).json({
            likedFoodIds: likedEntries.map((entry) => entry.food.toString())
        });
    } catch (error) {
        console.error("Error fetching liked food IDs:", error);
        res.status(500).json({
            message: "Failed to fetch liked items",
            likedFoodIds: []
        });
    }
}

async function getSavedFoodIds(req, res) {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                message: "Unauthorized",
                savedFoodIds: []
            });
        }

        const savedEntries = await saveModel.find({ user: req.user._id }).select('food');

        res.status(200).json({
            savedFoodIds: savedEntries.map((entry) => entry.food.toString())
        });
    } catch (error) {
        console.error("Error fetching saved food IDs:", error);
        res.status(500).json({
            message: "Failed to fetch saved items",
            savedFoodIds: []
        });
    }
}

async function likeFood(req, res) {
    try {
        const {foodId} = req.body;
        const user = req.user;

        if (!user?._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

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
    } catch (error) {
        console.error("Error in likeFood:", error);
        return res.status(500).json({
            message: "Failed to process like action",
            error: error.message
        });
    }
}

async function saveFood(req, res) {
    try {
        const {foodId} = req.body;
        const user = req.user;

        if (!user?._id) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

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
    } catch (error) {
        console.error("Error in saveFood:", error);
        return res.status(500).json({
            message: "Failed to process save action",
            error: error.message
        });
    }
}


module.exports = {createFood,
    getFoodItems,
    getLikedFoodIds,
    getSavedFoodIds,
    likeFood,
    saveFood
}