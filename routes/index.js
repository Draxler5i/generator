const express = require('express');
const router = express.Router();
const taskList = require('./taskList/taskList.route');
const user = require('./user/');
const book = require('./book/');
const car = require('./car');
const bike = require('./bike');
const table = require('./table');

router.use('/tasklist', taskList);
router.use('/user', user);
router.use('/book', book);
router.use('/car', car);
router.use('/bike', bike);
router.use('/table', table);

module.exports = router;