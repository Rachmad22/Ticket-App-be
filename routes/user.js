const express = require('express')
const router = express.Router();
const userController = require("../controllers/user");
const { validateCreateUser, validateEditUser, validateRole } = require('../middlewares/validation.js');
const { validateToken } = require('../middlewares/webtoken');

// Create user
router.post('/add', validateCreateUser, userController.createUser);

// Get user
router.get("/:id?", validateRole ,validateToken, userController.getUsers);

// Update user
router.patch('/edit/:id', validateEditUser, userController.editUser)

// Delete user
router.delete('/delete/:id', validateRole, validateToken, userController.deleteUser)

module.exports = router;