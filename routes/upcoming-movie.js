const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie');
const { validateCreateMovie, validateRole } = require('../middlewares/validation');
const { validateToken } = require('../middlewares/webtoken');

// Create movie
router.post('/add',validateToken, validateRole ,validateCreateMovie, movieController.createUpcomingMovie);

// Get movie
router.get('', movieController.getUpcomingMovie)

// Get searched movie
router.get('/search', movieController.getSearchedMovie)

module.exports = router;