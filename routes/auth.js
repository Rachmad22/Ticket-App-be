const express = require('express')
const router = express.Router()
const { validateLogin } = require('../middlewares/validation')
const authController = require('../controllers/login')

// UPDATE
router.post('/login', validateLogin, authController.login)

module.exports = router
