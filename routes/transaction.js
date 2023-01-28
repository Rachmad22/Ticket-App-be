const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transaction')
const { validateRole } = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')

// Create transaction
router.post('', validateToken, transactionController.createTransaction)

// Read transaction
router.get('', validateToken, transactionController.getTransaction)

// Read all transaction
// router.get()

// Update transaction
router.patch('/:id', validateToken, transactionController.updateTransaction)

// Delete transaction
router.delete('/:id', validateRole, validateToken, transactionController.deleteTransaction)

module.exports = router
