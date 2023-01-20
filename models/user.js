const db = require("../db");

// Create user to db
const createUser = async (params) => {
  const { firstname, lastname, phone, email, password } = params

  console.log(params)
  return await db`
  INSERT INTO user_accounts (firstname, lastname, phone, email, password)
  VALUES (${firstname}, ${lastname}, ${phone}, ${email}, ${password})
  `
} 

// Get user at db
const getAllUsers = async () => {
  return await db`SELECT * FROM user_accounts`
}

const getUserByEmail = async (params) => {
  const { email } = params

  return await db`SELECT * FROM user_accounts WHERE email = ${email}`
}

const getUserByPhone = async (params) => {
  const { phone } = params

  return await db`SELECT * FROM user_accounts WHERE phone = ${phone}`
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserByPhone,
};