const express = require("express");
const path = require('path');
const app = express();
const hbs = require('hbs');
const users = require("./mongodb");
const session = require('express-session');
const LoginHistory = require('./loginHistory');


const templatePath = path.join(__dirname, "../temp");

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.set("view engine", "hbs");

app.set("views", templatePath);

app.use(express.urlencoded({extended:false}));


app.use(express.static('public'));

// Add session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.get("/", (req, res) => {
    res.render("home", { 
        user: req.session.user,
        successMessage: req.session.successMessage 
    });
    // Clear success message after displaying
    delete req.session.successMessage;
});


app.get("/home", (req, res) => {
    res.render("home", { 
        user: req.session.user,
        successMessage: req.session.successMessage 
    });
    // Clear success message after displaying
    delete req.session.successMessage;
});

app.get("/regi", (req, res) => {
    res.render("regi", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});


// Add this new POST route for registration
app.post("/regi", async (req, res) => {
    try {
        const { email, password, conpassword } = req.body;
        
        // Check password length
        if (password.length < 8) {
            return res.render("regi", { error: "Password must be at least 8 characters long!" });
        }

        // Check if passwords match
        if (password !== conpassword) {
            return res.render("regi", { error: "Passwords do not match!" });
        }

        // Check if email already exists
        const existingUser = await users.findOne({ email: email });
        if (existingUser) {
            return res.render("regi", { error: "Email already registered!" });
        }

        const newUser = new users({
            email: email,
            password: password
        });

        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        // Check if error is due to duplicate email (MongoDB unique constraint violation)
        if (error.code === 11000) {
            return res.render("regi", { error: "Email already registered!" });
        }
        res.render("regi", { error: "Registration failed. Please try again." });
    }
});


app.get("/login", (req, res) => {
    res.render("login", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

// ... existing code ...

app.get("/seemore", (req, res) => {
    const productId = req.query.product;
    
    // Product database
    const products = {
        'after-effects': {
            id: 'after-effects',
            name: 'After Effects',
            price: '$100.00',
            image: '/Ae.jpg',
            description: 'Adobe After Effects is the industry-standard software for motion graphics and visual effects. Create sophisticated motion graphics and visual effects with the industry standard for animation and creative compositing.',
            features: [
                'Professional-grade visual effects and motion graphics',
                'Seamless integration with other Adobe products',
                'Advanced animation tools and effects',
                'Powerful 3D composition capabilities',
                'Extensive plugin support'
            ]
        },
        'premiere-pro': {
            id: 'premiere-pro',
            name: 'Premiere Pro',
            price: '$130.00',
            image: '/Pr.jpg',
            description: 'Professional video editing software for film, TV, and web content. Edit footage in any format, from 8K to virtual reality.',
            features: [
                'Professional video editing tools',
                'Multi-camera editing',
                'Auto reframe',
                'Audio editing workspace',
                'Motion graphics templates'
            ]
        },
        'photoshop': {
            id: 'photoshop',
            name: 'Photoshop',
            price: '$400.99',
            image: '/Ps.jpg',
            description: 'The world best imaging and graphic design software. Create and enhance photographs, illustrations, and 3D artwork.',
            features: [
                'Advanced photo editing',
                'Layer management',
                'Neural filters',
                'Smart object support',
                'Advanced selection tools'
            ]
        },
        'illustrator': {
            id: 'illustrator',
            name: 'Illustrator',
            price: '$239.88',
            image: '/Ai.jpg',
            description: 'The industry-standard vector graphics software used worldwide by designers to create everything from web and mobile graphics to logos, icons, book illustrations, product packaging, and billboards.',
            features: [
                'Vector graphic design',
                'Typography tools',
                'Precise alignment tools',
                'Cloud collaboration',
                'Responsive design'
            ]
        },
        'firefly': {
            id: 'firefly',
            name: 'Adobe Firefly',
            price: '$199.99',
            image: '/firefly.jpg',
            description: 'Create beautiful images, text effects, and vectors with generative AI. Transform your creative ideas into professional designs with ease.',
            features: [
                'AI-powered creation tools',
                'Text-to-image generation',
                'Style transfer',
                'Color harmony',
                'Creative suggestions'
            ]
        },
        'lightroom': {
            id: 'lightroom',
            name: 'Lightroom',
            price: '$119.99',
            image: '/Lr.jpg',
            description: 'Digital photography editing and organization software. Perfect for both professional photographers and enthusiasts.',
            features: [
                'Advanced photo organization',
                'Non-destructive editing',
                'Preset management',
                'Cloud storage',
                'Cross-device syncing'
            ]
        },
        'xd': {
            id: 'xd',
            name: 'Adobe XD',
            price: '$149.99',
            image: '/xd.jpg',
            description: 'Design, prototype, and share user experiences for websites, mobile apps, and more. The all-in-one UX/UI solution.',
            features: [
                'UI/UX design tools',
                'Interactive prototyping',
                'Component states',
                'Collaboration features',
                'Design systems'
            ]
        }
    };

    const selectedProduct = productId ? products[productId] : null;
    
    res.render('seemore', { 
        selectedProduct,
        user: req.session.user
    });
});

// ... rest of your code ...

app.get("/forgot", (req, res) => {
    res.render("forgot", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.get("/aboutus", (req, res) => {
    res.render("aboutus", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.get("/features", (req, res) => {
    res.render("features", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.get("/services", (req, res) => {
    res.render("services", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});


app.get("/indcart", (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
        req.session.successMessage = "Please login to access the Industry Store";
        return res.redirect("/login");
    }
    res.render("indcart", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.get("/grow", (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
        req.session.successMessage = "Please login to access the Business Store";
        return res.redirect("/login");
    }
    res.render("grow", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});
app.get("/game", (req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
        req.session.successMessage = "Please login to access the Game Store";
        return res.redirect("/login");
    }
    res.render("game", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});
app.get("/buynow", (req, res) => {
    res.render("buynow", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.get("/cart", (req, res) => {
    res.render("cart", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});


app.get("/payment", (req, res) => {
    res.render("payment", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.get("/user", (req, res) => {
    res.render("user", {
        user: req.session.user,
        successMessage: req.session.successMessage
    });
    delete req.session.successMessage;
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email: email });
        
        if (!user || user.password !== password) {
            return res.render("login", { error: "Invalid email or password!" });
        }

        // Record login history
        const loginRecord = new LoginHistory({
            email: user.email
        });
        await loginRecord.save();

        // Add admin check (you should modify this based on your needs)
        const isAdmin = email === 'admin@example.com'; // Example admin check

        req.session.user = { 
            email: user.email,
            isAdmin: isAdmin
        };
        
        req.session.successMessage = "Login successful!";
        
        // Redirect admin users to admin panel
        if (isAdmin) {
            res.redirect("/admin");
        } else {
            res.redirect("/home");
        }
    } catch (error) {
        res.render("login", { error: "Login failed. Please try again." });
    }
});

// Add logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
});

// Add Handlebars helper for rating stars
hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; i++)
        accum += block.fn(i);
    return accum;
});

// Update product route with more complete product data
app.get("/product/:name", (req, res) => {
    const productName = decodeURIComponent(req.params.name);
    
    // Product data
    const products = {
        // Software/Buynow Products
        'After Effect': {
            name: 'After Effect',
            price: '$100.00',
            image: '/After-effect.webp',
            category: 'Software',
            rating: 5,
            description: 'After Effects is a digital visual effects, motion graphics, and compositing application developed by Adobe Systems and used in the post-production process of film making, video games and television production.',
            features: [
                'Motion Graphics',
                'Visual Effects',
                'Video Compositing',
                'Animation Tools',
                'Professional Templates'
            ],
            gallery: ['/After-effect.webp']
        },
        'Premiere Pro': {
            name: 'Premiere Pro',
            price: '$130.00',
            image: '/Premiere Pro.svg',
            category: 'Software',
            rating: 4,
            description: 'Adobe Premiere Pro is the leading editing software for creating any kind of video. Add transitions and effects, finesse colour, mix audio, create animated titles and get all the tools to tell your story.',
            features: [
                'Professional Video Editing',
                'Audio Mixing',
                'Color Correction',
                'Motion Graphics Templates',
                'Multi-camera Editing'
            ],
            gallery: ['/Premiere Pro.svg']
        },
        'Photoshop': {
            name: 'Photoshop',
            price: '$400.99',
            image: '/Photoshop.svg',
            category: 'Software',
            rating: 5,
            description: 'Start with Photoshop. Amazing will follow. Fire up your imagination with the most powerful Photoshop yet. Remove distractions in a click. Get amazing photorealistic results with Generative Fill.',
            features: [
                'Advanced Photo Editing',
                'Generative Fill',
                'Layer Management',
                'Smart Objects',
                'Neural Filters'
            ],
            gallery: ['/Photoshop.svg']
        },

        // Game Products
        'Technotopia': {
            name: 'Technotopia',
            price: '$50.56',
            image: '/technotopia.avif',
            category: 'Game',
            rating: 4,
            description: 'Technotopia is a city-builder roguelike card game. Take on the role of an AI designed to build a perfect city.',
            features: [
                'City Building',
                'Card Game Mechanics',
                'AI Integration',
                'Resource Management',
                'Multiple Scenarios'
            ],
            gallery: ['/technotopia.avif']
        },
        'Hordes of Hel': {
            name: 'Hordes of Hel',
            price: '$84.95',
            image: '/hordes-of-hel.avif',
            category: 'Game',
            rating: 4,
            description: 'Hordes of Hel is a gripping roguelike horde-survivor game set in the dark realms of Norse Mythology.',
            features: [
                'Norse Mythology Setting',
                'Roguelike Elements',
                'Horde Combat',
                'Character Progression',
                'Boss Battles'
            ],
            gallery: ['/hordes-of-hel.avif']
        },
        'Egregore': {
            name: 'Egregore',
            price: '$85.32',
            image: '/egregore.avif',
            category: 'Game',
            rating: 4,
            description: 'Embark on a first-person adventure to a mysterious café in Cairo. Adopt a new perspective and shape reality to your will as you unravel an occult conspiracy hidden in plain sight.',
            features: [
                'First-Person Adventure',
                'Mystery Solving',
                'Occult Theme',
                'Reality Manipulation',
                'Immersive Story'
            ],
            gallery: ['/egregore.avif']
        },

        // Industry Products
        'Adobe Premiere Pro': {
            name: 'Adobe Premiere Pro',
            price: '$239.88',
            image: '/premiere-pro.svg',
            category: 'Industry',
            rating: 5,
            description: 'Professional video editing software for film, TV, and the web.',
            features: [
                'Professional Video Editing',
                'Audio Mixing',
                'Color Correction',
                'Multi-camera Editing',
                'Advanced Effects'
            ],
            gallery: ['/premiere-pro.svg']
        },
        'Adobe Photoshop': {
            name: 'Adobe Photoshop',
            price: '$239.88',
            image: '/photoshop.svg',
            category: 'Industry',
            rating: 5,
            description: 'The world\'s best imaging and graphic design software.',
            features: [
                'Advanced Photo Editing',
                'Layer Management',
                'Smart Objects',
                'Neural Filters',
                'Creative Tools'
            ],
            gallery: ['/photoshop.svg']
        },
        'QuickBooks Online': {
            name: 'QuickBooks Online',
            price: '$25.00',
            image: '/Online Book.svg',
            category: 'Industry',
            rating: 4,
            description: 'Accounting software to manage your business finances.',
            features: [
                'Financial Management',
                'Invoicing',
                'Expense Tracking',
                'Payroll',
                'Tax Tools'
            ],
            gallery: ['/Online Book.svg']
        },
        'Blender': {
            name: 'Blender',
            price: '$155.00',
            image: '/blender.png',
            category: 'Industry',
            rating: 4,
            description: 'Open-source 3D modeling, animation, and rendering software.',
            features: [
                '3D Modeling',
                'Animation Tools',
                'Rendering Engine',
                'Video Editing',
                'Visual Effects'
            ],
            gallery: ['/Blender.png']
        },
        'Autodesk Maya': {
            name: 'Autodesk Maya',
            price: '$1,545.00',
            image: '/maya.webp',
            category: 'Industry',
            rating: 5,
            description: '3D modeling and animation software for film and games.',
            features: [
                'Advanced 3D Modeling',
                'Character Animation',
                'Visual Effects',
                'Rendering',
                'Simulation Tools'
            ],
            gallery: ['/maya.webp']
        },
        'Maxon Cinema 4D': {
            name: 'Maxon Cinema 4D',
            price: '$999.00',
            image: '/cinema4d.png',
            category: 'Industry',
            rating: 4,
            description: 'Professional 3D modeling, animation, and rendering software.',
            features: [
                '3D Modeling',
                'Motion Graphics',
                'Character Animation',
                'Visualization',
                'Physical Rendering'
            ],
            gallery: ['/cinema4d.png']
        },

        // Business/Grow Products
        'The Lean Startup': {
            name: 'The Lean Startup',
            price: '$29.99',
            image: '/BB book.jpeg',
            category: 'Business',
            rating: 5,
            description: 'Learn how to build a successful startup with this essential guide.',
            features: [
                'Startup Methodology',
                'Business Strategy',
                'Innovation Techniques',
                'Market Testing',
                'Growth Tactics'
            ],
            gallery: ['/BB book.jpeg']
        },
        'Digital Marketing Masterclass': {
            name: 'Digital Marketing Masterclass',
            price: '$49.99',
            image: '/DM masterclass.jpeg',
            category: 'Business',
            rating: 4,
            description: 'Master digital marketing strategies to grow your business.',
            features: [
                'SEO Techniques',
                'Social Media Marketing',
                'Content Strategy',
                'Email Marketing',
                'Analytics'
            ],
            gallery: ['/DM masterclass.jpeg']
        },
        'Daily Productivity Planner': {
            name: 'Daily Productivity Planner',
            price: '$19.99',
            image: '/Daily productive.webp',
            category: 'Business',
            rating: 4,
            description: 'Stay organized and boost your productivity with this planner.',
            features: [
                'Task Management',
                'Goal Setting',
                'Time Tracking',
                'Priority Planning',
                'Progress Monitoring'
            ],
            gallery: ['/Daily productive.webp']
        },
        'Personal Development Course': {
            name: 'Personal Development Course',
            price: '$59.99',
            image: '/Personal.webp',
            category: 'Business',
            rating: 5,
            description: 'Enhance your skills and mindset for personal and professional growth.',
            features: [
                'Leadership Skills',
                'Communication',
                'Time Management',
                'Goal Setting',
                'Stress Management'
            ],
            gallery: ['/Personal.webp']
        },
        'Startup Networking Event': {
            name: 'Startup Networking Event',
            price: '$39.99',
            image: '/Networking.jpeg',
            category: 'Business',
            rating: 4,
            description: 'Connect with other entrepreneurs and grow your network.',
            features: [
                'Networking Sessions',
                'Expert Speakers',
                'Workshop Sessions',
                'Pitch Opportunities',
                'Business Matching'
            ],
            gallery: ['/Networking.jpeg']
        },
        '1-on-1 Business Coaching': {
            name: '1-on-1 Business Coaching',
            price: '$199.99',
            image: '/1To1.webp',
            category: 'Business',
            rating: 5,
            description: 'Get personalized coaching to help you grow your business.',
            features: [
                'Personalized Strategy',
                'Business Analysis',
                'Growth Planning',
                'Performance Tracking',
                'Accountability Support'
            ],
            gallery: ['/1To1.webp']
        }
    };

    const product = products[productName];
    
    if (product) {
        // Get related products (excluding current product)
        const relatedProducts = Object.values(products)
            .filter(p => p.name !== productName && p.category === product.category)
            .slice(0, 3) // Show only 3 related products
            .map(p => ({
                ...p,
                id: encodeURIComponent(p.name)
            }));

        res.render("product", { 
            product,
            relatedProducts,
            user: req.session.user
        });
    } else {
        console.log(`Product not found: ${productName}`);
        res.redirect("/buynow");
    }
});

// Add admin routes
app.get("/admin", async (req, res) => {
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

        // Register Handlebars helper for date formatting
        hbs.registerHelper('formatDate', function(date) {
            return new Date(date).toLocaleString();
        });

        res.render("admin", {
            users: recentUsers,
            loginHistory: loginHistory
        });
    } catch (error) {
        res.render("admin", { error: "Failed to load admin data" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
