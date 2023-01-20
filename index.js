const express = require("express");
const app = express(); // Initialization
const cors = require('cors')
const port = 3001;
const bodyParser = require("body-parser");
const helmet = require('helmet');
const xss = require('xss-clean');
const fileUpload = require('express-fileupload')
const path = require('path')

// Parse application urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application body parser
app.use(bodyParser.json())

// App routes
const userRoutes = require("./routes/user");
const authRoutes = require('./routes/auth')

app.use(cors())

app.use(helmet())

app.use(xss())

// User
app.use("/user", userRoutes)

app.use('/auth', authRoutes)

// Movie
// app.use('/' )

// Display
app.get("/", (req, res) => {
  res.json({ status: true, message: "Server running", version: "1.0"})
})

// Check port
app.listen(port, () => {
  console.log(`Tickitz App listening on port ${port}`)
})