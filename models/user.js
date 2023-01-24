const db = require('../db')

// Create user to db
const createUser = async (params) => {
  const { firstname, lastname, phone, email, password } = params

  return await db`
  INSERT INTO user_accounts (firstname, lastname, phone, email, password)
  VALUES (${firstname}, ${lastname}, ${phone}, ${email}, ${password})
  `
}

const createUserWithRole = async (params) => {
  const { firstname, lastname, phone, email, password, role } = params

  return await db`
  INSERT INTO user_accounts (firstname, lastname, phone, email, password, role)
  VALUES (${firstname}, ${lastname}, ${phone}, ${email}, ${password}, ${role})
  `
}

// Get user from db
const getAllUsers = async () => {
  return await db`SELECT * FROM user_accounts`
}

const getUserEmail = async (params) => {
  const { email } = params

  return await db`SELECT email FROM user_accounts WHERE email = ${email}`
}

const getUserByEmail = async (params) => {
  const { email } = params

  return await db`SELECT * FROM user_accounts WHERE email = ${email}`
}

const getUserPhone = async (params) => {
  const { phone } = params

  return await db`SELECT phone FROM user_accounts WHERE phone = ${phone}`
}

const getUserById = async (params) => {
  const { id } = params

  return await db`SELECT * FROM user_accounts WHERE id = ${id}`
}

// Update user to db
const editUserPhoto = async (params) => {
  const { id, firstname, lastname, phone, email, password, photo, getUser } = params

  return await db`
  UPDATE user_accounts SET
  "firstname" = ${firstname || getUser[0]?.firstname},
  "lastname" = ${lastname || getUser[0]?.lastname},
  "phone" = ${phone || getUser[0]?.phone},
  "email" = ${email || getUser[0]?.email},
  "password" = ${password || getUser[0]?.password},
  "photo" = ${photo || getUser[0]?.photo}
  WHERE "id" = ${id}
  `
}

const editUser = async (params) => {
  const { id, firstname, lastname, phone, email, password, getUser } = params

  return await db`
  UPDATE user_accounts SET
  "firstname" = ${firstname || getUser[0]?.firstname},
  "lastname" = ${lastname || getUser[0]?.lastname},
  "phone" = ${phone || getUser[0]?.phone},
  "email" = ${email || getUser[0]?.email},
  "password" = ${password || getUser[0]?.password}
  WHERE "id" = ${id}
  `
}

// Delete user from db
const deleteUser = async (params) => {
  const { id } = params

  return await db`DELETE FROM "public"."user_accounts" WHERE id = ${id}`
}

module.exports = {
  createUser,
  createUserWithRole,
  getAllUsers,
  getUserEmail,
  getUserByEmail,
  getUserPhone,
  getUserById,
  editUserPhoto,
  editUser,
  deleteUser
}
