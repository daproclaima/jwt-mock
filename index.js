const express = require ('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

// Imports routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')

const app = express()
const port = 3333
dotenv.config()

// connect to db
mongoose.connect(process.env.DB_CONNECT, 
  {
    useUnifiedTopology: true ,
    useNewUrlParser: true 
  },
  () => console.log('connected to db'))

// Middleware
app.use(express.json())

// Routes middleware
app.use('/api/user', authRoute, function (req, res) {
  res.sendStatus(500)
})
app.use('/api/posts', postRoute)



app.listen(port, () => console.log(`Server up an and running at http://localhost:${port}`))