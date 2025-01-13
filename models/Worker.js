const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    age: Number,
    gender: String,
    address: String,
    language: String,
    religion: String,
    aadhar: String,
    city: String,
    profession: String,
    pastExperience: String,
    experience: Number,
    salary: Number
});

module.exports = mongoose.model('Worker', workerSchema);
