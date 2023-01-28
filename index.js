const express = require('express')
const app = express() // Initialization
const cors = require('cors')
const port = 3001 // Port used on localhost
const bodyParser = require('body-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const fileUpload = require('express-fileupload')

// Parse application urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application body parser
app.use(bodyParser.json())

// App routes
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const availableMovieRoutes = require('./routes/available-movie')
const upcomingMovieRoutes = require('./routes/upcoming-movie')
const paymentRoutes = require('./routes/transaction')

// Use cors
app.use(cors()) // For all use

// Use helmet
app.use(helmet())

// Use xss
app.use(xss())

// For grant access upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

// User
app.use('/user', userRoutes)

app.use('/auth', authRoutes)

// Movie
app.use('/movies', availableMovieRoutes)

app.use('/upcoming-movies', upcomingMovieRoutes)

// Transaction
app.use('/payment', paymentRoutes)

// Display
app.get('/', (req, res) => {
  res.json({ status: true, message: 'Server running', version: '1.0' })
})

// Check port
app.listen(port, () => {
  console.log(`Tickitz App listening on port ${port}`)
})
