const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).render('error', { message: 'Profile not found' });
    }
    res.render('profile', { worker });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
});

module.exports = router;