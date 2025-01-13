const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { isAuthenticated } = require('./auth');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('worker')
            .sort({ date: -1 });
        res.render('booking-list', { bookings });
    } catch (error) {
        res.status(500).render('error', { message: 'Server Error' });
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const booking = new Booking({
            ...req.body,
            user: {
                id: req.session.userId,
                name: req.session.name,
                email: req.session.email
            }
        });
        await booking.save();
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).render('error', { message: 'Booking failed' });
    }
});

router.post('/update-status', isAuthenticated, async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        await Booking.findByIdAndUpdate(bookingId, { status });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).render('error', { message: 'Status update failed' });
    }
});

router.post('/cancel', isAuthenticated, async (req, res) => {
    try {
        const { bookingId } = req.body;
        await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).render('error', { message: 'Cancellation failed' });
    }
});

module.exports = router;