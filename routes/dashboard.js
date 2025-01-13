const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./auth');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        let data = {};

        if (user.role === 'worker') {
            // For workers, show their bookings
            data.bookings = await Booking.find({ worker: req.session.userId })
                                      .populate('user');
            data.profile = await Worker.findOne({ userId: req.session.userId });
        } else {
            // For customers, show their bookings
            data.bookings = await Booking.find({ 'user.email': user.email })
                                      .populate('worker');
        }

        res.render('dashboard', { 
            user,
            data,
            role: user.role
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Error loading dashboard' });
    }
});

module.exports = router;