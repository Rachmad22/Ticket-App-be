const db = require('../db')

const createTransaction = async (params) => {
  const { user_id, date, movie_title, cinema, total_payment } = params

  return await db`INSERT INTO transactions (user_id, date, movie_title, cinema, total_payment) VALUES (${user_id},${date}, ${movie_title}, ${cinema}, ${total_payment})`
}

const getTransaction = async (params) => {
  const { user_id } = params

  return await db`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY id DESC`
}

const getTransactionById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM transactions WHERE id = ${id}`
}

const getAllTransactionUser = async () => {
  return await db`SELECT * FROM transactions`
}

const updateStatusTransaction = async (params) => {
  const { status, id } = params

  return await db`UPDATE transactions SET "status"= ${status} WHERE id = ${id}`
}

const deleteTransaction = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."transactions" WHERE id = ${id}`
}

module.exports = {
  createTransaction,
  getTransaction,
  getAllTransactionUser,
  getTransactionById,
  updateStatusTransaction,
  deleteTransaction
}
