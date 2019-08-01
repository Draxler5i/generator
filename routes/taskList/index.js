const express = require('express');
const router = express.Router();
const taskListController = require('./controller');

router.get('/:id', taskListController.get);
router.get('/', taskListController.get);
router.post('/', taskListController.post);
router.put('/:id', taskListController.put);
router.delete('/:id', taskListController.delete);

module.exports = router;
