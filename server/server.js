const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const XMLHttpRequest = require('xhr2')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')

dotenv.config({ path: './config/config.env' })

global.XMLHttpRequest = XMLHttpRequest

const auth = require('./routes/auth')
const profiles = require('./routes/profiles')
const posts = require('./routes/posts')

// Run server
const app = express()

app.use(cors())

app.use(bodyParser.json())

// Authentication route
app.use('/api/auth', auth)

// Posts route
app.use('/api/posts', posts)

//Profiles route
app.use('/api/profiles', profiles)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Port is running on ${process.env.NODE_ENV} mode on port ${PORT}`)
)
