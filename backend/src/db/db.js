const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
        .then( () => {
            console.log("MonogoDB Connected");
        })
        .catch( (err) => {
            console.log("MongoDB connection error", err);
        })
}

module.exports = connectDB;