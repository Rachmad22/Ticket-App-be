const express = require('express')
const router = express.Router();
const userController = require("../controllers/user");
const { validateCreateUser, validateEditUser } = require('../middlewares/validation.js');

// Create user
router.post('/add', validateCreateUser, userController.createUser);

// Get user
router.get("/:id?", userController.getUsers);

module.exports = router;