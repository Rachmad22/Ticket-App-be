const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movie')
const { useRedis } = require('../middlewares/redis')
const { validateCreateMovie, validateRole } = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')

// Create movie
router.post('/add', validateRole, validateCreateMovie, movieController.createAvailableMovie)

// Get movie
router.get('', useRedis, movieController.getAvailableMovie)

// Get searched movie
router.get('/search/:name', movieController.getSearchedAvailableMovie)

// Update movie
router.patch('/edit/:id', validateRole, validateToken, movieController.editAvailableMovie)

// Delete movie
router.delete('/delete/:id', validateRole, validateToken, movieController.deleteAvailableMovie)

module.exports = router
