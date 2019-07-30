const express = require('express');
const router = express.Router();
const taskList = require('./taskList');

router.use('/tasklist', taskList);

module.exports = router;