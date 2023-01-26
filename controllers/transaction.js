const transaction = require('../models/transaction')
const jwt = require('jsonwebtoken')

// Create
const createTransaction = async (req, res) => {
  try {
    const { date, movie_title, cinema, total_payment } = req.body
    const { authorization } = req.headers

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    const userId = decoded?.id
    const createNewTransaction = await transaction.createTransaction({ user_id: userId, date, movie_title, cinema, total_payment })

    res.json({
      status: true,
      message: 'Transaction added successful',
      data: createNewTransaction
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Read
const getTransaction = async (req, res) => {
  try {
    const { authorization } = req.headers

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    const userId = decoded?.id
    const getSelectedTransactions = await transaction.getTransaction({ user_id: userId })

    res.json({
      status: true,
      message: 'Transaction retrieved successful',
      data: getSelectedTransactions
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

// Update (Update status from new to already used)
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const { authorization } = req.headers

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    const userId = decoded?.id

    const getSelectedTransactions = await transaction.getTransaction({ user_id: userId })

    const newTicket = getSelectedTransactions[0]?.id
    const checkTransaction = await transaction.getTransactionById({ id: newTicket })

    if (checkTransaction.length === 0) {
      throw { code: 401, message: 'Ticket is not defined' }
    }

    const editStatusTransaction = await transaction.updateStatusTransaction({ id, status: 'already used' })

    const newTransaction = await transaction.getTransactionById({ id })

    res.json({
      status: true,
      message: 'Status updated successful',
      data: newTransaction[0]
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await transaction.getTransactionById({ id })

    if (checkId.length === 0) {
      throw { code: 401, message: 'Data is empty, please try again' }
    }

    await transaction.deleteTransaction({ id })

    res.json({
      status: true,
      message: 'Transaction deleted successful'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction
}
