const express = require('express');
const router = express.Router();
const taskList = require('./taskList/');
const github = require('./github');
const msTeamsMessage = require('../middlewares/MsTeamsMessage');
const dbLog = require('../middlewares/logDataBase');

router.use(dbLog, msTeamsMessage);
router.use('/tasklist', taskList);
router.use('/github', github);

module.exports = router;