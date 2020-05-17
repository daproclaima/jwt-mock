const express = require ('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const router  = express.Router()
const authRoute = require('./routes/auth')
const app = express()
const port = 4444
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

app.listen(port, () => console.log(`JWT Server up an and running at http://localhost:${port}`))
