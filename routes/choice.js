const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Worker = require('../models/Worker');
const router = express.Router();

// MongoDB connection setup
mongoose.connect('mongodb+srv://kanishkg070:eEF8fx2WbogY0bU8@workerscluster.7ry7q.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Path to the JSON file
const workersFilePath = path.join(__dirname, '../data/workers.json');

// Render the worker registration form
router.get('/workers-form', (req, res) => {
    res.render('workers-form');
});

// Handle form submission and save data to MongoDB
router.post('/register-worker', async (req, res) => {
    const { name, phone, age, gender, address, language, religion, aadhar, city, profession, pastExperience, experience, salary
    } = req.body;

    try {
        // Create a new worker object and save it to MongoDB
        const newWorker = new Worker({
            name,
            phone,
            age,
            gender,
            address,
            language,
            religion,
            aadhar,
            city,
            profession,
            pastExperience,
            experience,
            salary
            
        });
        await newWorker.save();

        // Fetch all workers from MongoDB and update workers.json
        const workers = await Worker.find();

        // Write the data to workers.json
        fs.writeFile(workersFilePath, JSON.stringify(workers, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).send('Error updating workers.json');
            }
            // Redirect to the thank you page after successful registration
            res.redirect('/thank-you');
        });
    } catch (error) {
        console.error('Error saving worker to MongoDB:', error);
        res.status(500).send('Error saving worker');
    }
});

// Render the thank you page
router.get('/thank-you', (req, res) => {
    res.render('thank-you');
});

// Render the workers list page
router.get('/workers-list', (req, res) => {
    fs.readFile(workersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).send('Error fetching workers');
        }

        let workers = [];
        try {
            workers = data ? JSON.parse(data) : [];
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing worker data');
        }

        res.render('workers-list', { workers: workers });
    });
});

// Route to sync workers data from MongoDB to workers.json
router.get('/sync-workers-json', async (req, res) => {
    try {
        const workers = await Worker.find();
        fs.writeFile(workersFilePath, JSON.stringify(workers, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).send('Error updating workers.json');
            }
            console.log('workers.json updated from MongoDB');
            res.send('workers.json updated from MongoDB');
        });
    } catch (error) {
        console.error('Error fetching workers from MongoDB:', error);
        res.status(500).send('Error fetching workers from MongoDB');
    }
});

// Route to delete a worker by ID
router.delete('/delete-worker/:id', async (req, res) => {
    const workerId = req.params.id;

    try {
        // Delete the worker from MongoDB
        await Worker.findByIdAndDelete(workerId);

        // Fetch the updated list of workers from MongoDB
        const workers = await Worker.find();

        // Write the updated list to workers.json
        fs.writeFile(workersFilePath, JSON.stringify(workers, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).send('Error updating workers.json');
            }
            console.log('Worker deleted and workers.json updated');
            res.status(200).send('Worker deleted successfully');
        });
    } catch (error) {
        console.error('Error deleting worker from MongoDB:', error);
        res.status(500).send('Error deleting worker');
    }
});

// Route to update a worker by ID
router.put('/update-worker/:id', async (req, res) => {
    const workerId = req.params.id;
    const { name, phone, age, gender, address, language, religion, aadhar, city, profession, pastExperience, experience, salary
 } = req.body;

    try {
        // Update the worker in MongoDB
        const updatedWorker = await Worker.findByIdAndUpdate(
            workerId,
            { name, phone, age, gender, address, language, religion, aadhar, city, profession, pastExperience, experience, salary
 },
            { new: true } // Return the updated document
        );

        // Fetch the updated list of workers from MongoDB
        const workers = await Worker.find();

        // Write the updated list to workers.json
        fs.writeFile(workersFilePath, JSON.stringify(workers, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).send('Error updating workers.json');
            }
            console.log('Worker updated and workers.json updated');
            res.status(200).send('Worker updated successfully');
        });
    } catch (error) {
        console.error('Error updating worker in MongoDB:', error);
        res.status(500).send('Error updating worker');
    }
});
// Route to create a new worker
router.post('/create-worker', async (req, res) => {
    const { name, phone, age, gender, address, language, religion, aadhar, city, profession, pastExperience, experience, salary } = req.body;

    try {
        // Create a new worker object and save it to MongoDB
        const newWorker = new Worker({
            name,
            phone,
            age,
            gender,
            address,
            language,
            religion,
            aadhar,
            city,
            profession,
            pastExperience,
            experience,
            salary
        });
        await newWorker.save();

        // Fetch all workers from MongoDB and update workers.json
        const workers = await Worker.find();

        // Write the data to workers.json
        fs.writeFile(workersFilePath, JSON.stringify(workers, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).send('Error updating workers.json');
            }
            console.log('New worker added and workers.json updated');
            res.status(201).send('Worker created successfully');
        });
    } catch (error) {
        console.error('Error creating worker in MongoDB:', error);
        res.status(500).send('Error creating worker');
    }
});

module.exports = router;
