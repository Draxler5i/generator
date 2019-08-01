const express = require('express');
const router = express.Router();
const githubController = require('./controller');

router.use( (req, res, next) => { 
    // req.serviceLog.name = "Github Controller";
    next();
});

router.get('/:id', githubController.get);
router.get('/', githubController.get);
router.post('/', githubController.post);
router.put('/:id', githubController.put);
router.delete('/:id', githubController.delete);

module.exports = router;
