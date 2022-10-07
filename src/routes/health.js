const router = require('express').Router();
const axios = require('axios');

router.get('/', (req, res) => {
    res.json({'status': 'UP'});
});

router.get('/ping/:name', (req, res) => {
    let name = req.params.name || 'Hello'
    res.json({'message': `pong: ${name}`});
});

module.exports = router;