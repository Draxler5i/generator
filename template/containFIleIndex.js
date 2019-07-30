module.exports = getText = (args) => {
    const controller = `${args}Controller`;
    const text = `const express = require('express');
const router = express.Router();
const ${controller} = require('./controller');

router.get('/:id', ${controller}.get);
router.get('/', ${controller}.get);
router.post('/', ${controller}.post);
router.put('/:id', ${controller}.put);
router.delete('/:id', ${controller}.delete);

module.exports = router;
`;
    return text;
};