const express = require('express')
const router = express.Router();
const userController = require("../controllers/user");
const { validateCreateUser, validateEditUser } = require('../middlewares/validation.js');
const { validateToken } = require('../middlewares/webtoken');

// Create user
router.post('/add', validateCreateUser, userController.createUser);

// Get user
router.get("/:id?", validateToken, userController.getUsers);

module.exports = router;