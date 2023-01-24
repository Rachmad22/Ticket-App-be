const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movie')
const { useRedis } = require('../middlewares/redis')
const { validateCreateMovie, validateRole } = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')

// Create movie
router.post('/add', validateToken, validateRole, validateCreateMovie, movieController.createUpcomingMovie)

// Get movie
router.get('', useRedis, movieController.getUpcomingMovie)

// Update movie
router.patch('/edit/:id', validateRole, validateToken, movieController.editUpcomingMovie)

// Delete movie
router.delete('/delete/:id', validateRole, validateToken, movieController.deleteUpcomingMovie)

module.exports = router
