const express = require('express');
const router = express.Router();

const corsController = require('../controllers/cors');

router.route('/*')
  .options(corsController);

module.exports = router;