const mongoose = require('mongoose');

const foodPartnerSchema = mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('FoodPartner', foodPartnerSchema);