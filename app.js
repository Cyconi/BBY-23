require('dotenv').config();
const express = require('express');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const User = require("./modules/user.js");

// EJS 
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'webapp', 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/js", express.static("./webapp/public/js"));
app.use("/css", express.static("./webapp/public/css"));
app.use("/img", express.static("./webapp/public/img"));
app.use("/scenario", express.static("./scenario"));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 3600000 }
}));

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("MongoDB connected successfully");
        
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });
// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./modules/passport')(passport);

// Routes
app.use('/', require('./modules/home'));
app.use('/interpersonal', require('./modules/interpersonal'));
app.get('/select-scenario', (req, res) => {
    res.render('select_scenario');
});

app.post('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out');
            }
            res.redirect('/'); 
        });
    });
});

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
});

// Start the server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
