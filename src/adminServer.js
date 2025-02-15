const express = require("express");
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const users = require("./mongodb");
const LoginHistory = require('./loginHistory')

const app = express();

app.use(express.static(path.join(__dirname, '../public')));


const templatePath = path.join(__dirname, "../temp");

app.set("view engine", "hbs");
app.set("views", templatePath);

// Register Handlebars helper for date formatting
hbs.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleString();
});

app.get("/", async (req, res) => {
    try {
        // Get recent registrations (last 10)
        const recentUsers = await users.find()
            .sort({ registeredAt: -1 })
            .limit(10)
            .select('email registeredAt');

        // Get recent login history (last 10)
        const loginHistory = await LoginHistory.find()
            .sort({ timestamp: -1 })
            .limit(10);

        res.render("admin", {
            users: recentUsers,
            loginHistory: loginHistory
        });
    } catch (error) {
        res.render("admin", { error: "Failed to load admin data" });
    }
});

app.listen(3000, () => {
    console.log("Admin server running on port 3000");
});