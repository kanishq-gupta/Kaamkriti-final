const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Login route
router.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/choice');
    }
    res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.render('auth/login', { error: 'Invalid email or password' });
        }

        req.session.userId = user._id;
        console.log('Session after login:', req.session); // Debugging
        res.redirect('/choice');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', { error: 'Login failed. Please try again.' });
    }
});

// Signup route
router.get('/signup', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/choice');
    }
    res.render('auth/signup', { error: null });
});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/signup', { error: 'Email already registered' });
        }

        const user = new User({
            name,
            email,
            password,
            role: role || 'user'
        });

        await user.save();
        req.session.userId = user._id;
        res.redirect('/choice');
    } catch (error) {
        console.error('Signup error:', error);
        res.render('auth/signup', { error: 'Registration failed. Please try again.' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.clearCookie('connect.sid'); // Clear the cookie
        res.redirect('/');
    });
});

module.exports = { router, isAuthenticated };
