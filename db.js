require('dotenv').config()
const postgres = require('postgres')

// connect to db
const connect = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD // Use the password you created
})

module.exports = connect
