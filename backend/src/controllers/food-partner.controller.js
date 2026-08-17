const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getFoodPartnerById(req,res) {
    
    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if(!foodPartner){
        return res.status(404).json({
            message: "Food Partner not found"
        });
    }

    const foodItemsByFoodPartner = await foodModel.find({foodPartner: foodPartnerId});

    res.status(200).json({
        message: 'food partner retrieved successfully',
        foodPartner: {
            ...foodPartner.toObject(),
            totalMeals: foodItemsByFoodPartner.length,
            totalCustomers: 0,
            foodItems: foodItemsByFoodPartner
        }
    });
}

module.exports = {getFoodPartnerById};