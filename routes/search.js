const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie');
const { validateToken } = require('../middlewares/webtoken');

router.get('/:name', validateToken, movieController.getSearchedMovie)

module.exports = router;