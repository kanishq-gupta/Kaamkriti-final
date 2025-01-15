const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.render('workers-list', { workers });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).render('error', { message: 'Worker not found' });
    }
    res.render('profile', { worker });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;