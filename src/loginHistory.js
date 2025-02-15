const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/login")
    .then(() => {
        console.log("Database connection successful")
    })
    .catch((err) => {
        console.log("Database connection failed:", err)
    });


const loginHistorySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema); 