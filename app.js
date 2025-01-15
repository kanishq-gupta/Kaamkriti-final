require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const path = require('path');
const { router: authRouter, isAuthenticated } = require('./routes/auth');
const choiceRoutes = require('./routes/choice');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kanishkg070:eEF8fx2WbogY0bU8@workerscluster.7ry7q.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session configuration with MongoDB store
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://kanishkg070:eEF8fx2WbogY0bU8@workerscluster.7ry7q.mongodb.net/test',
        ttl: 24 * 60 * 60 // Session TTL (1 day)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth middleware to make user data available to all templates
app.use(async (req, res, next) => {
    res.locals.user = null;
    if (req.session.userId) {
        try {
            const User = require('./models/User');
            const user = await User.findById(req.session.userId);
            res.locals.user = user;
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    next();
});
app.get('/thank-you', (req, res) => {
    res.render('thank-you'); // Directly render the page
});


// Routes
app.use('/', require('./routes/index'));
app.use('/', authRouter);
app.use('/workers', require('./routes/workers'));
app.use('/profile', isAuthenticated, require('./routes/profile'));
app.use('/booking', isAuthenticated, require('./routes/booking'));
app.use('/', require('./routes/dashboard'));
app.use('/', choiceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});