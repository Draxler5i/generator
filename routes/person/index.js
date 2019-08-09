const express = require('express');
const router = express.Router();
const peronController = require('./controller');

router.get('/:id', peronController.get);
router.get('/', peronController.get);
router.post('/', peronController.post);
router.put('/:id', peronController.put);
router.delete('/:id', peronController.delete);

module.exports = router;
