const mongoose = require('mongoose');

// Fix the MongoDB URL (remove extra slash)
mongoose.connect("mongodb://localhost:27017/login")
    .then(() => {
        console.log("Database connection successful")
    })
    .catch((err) => {
        console.log("Database connection failed:", err)
    });

    
    const database = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    })

    
const users = new mongoose.model("collection",database)
module.exports = users