const router  = require('express').Router()
const User = require('../../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {generateAccessToken, generateRefreshToken} = require('../manageToken')
const { registerValidation, loginValidation } = require('../../routes/validation')

router.post('/register', async (req, res) => {

  // Validate schema before to make an user
  const { error } = registerValidation(req.body)
  if(error) { 
    return res.status(403).send(error.details[0].message)
  }

  // Check if user is already in db
  const emailExist = await User.findOne({email: req.body.email})
  if(emailExist) {
    return res.status(400).send('Email already exists.')
  }

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  try {
    await user.save()
    res.send({user: user._id})
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
})

// Login
router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if(error) { 
    return res.status(403).send(error.details[0].message)
  }

  // check email exists
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send('Email or password is wrong.')
  }
  const validPass = await bcrypt.compare(req.body.password, user.password)
  if (!validPass) {
    return res.status(400).send('Email or password is wrong.')
  }

  // Creates and assign a token
  // const token = jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET )
  const accessToken = generateAccessToken({_id: user._id}, process.env.ACCESS_TOKEN_SECRET)
  const refreshToken = generateRefreshToken({_id: user._id}, process.env.REFRESH_TOKEN_SECRET)

  res.header({'auth-token': accessToken, 'refresh-token': refreshToken}).send({accessToken, refreshToken})

  // check if password is correct


})

router.post('/token', (req, res) => {
  const refreshTokens = []
  const refreshToken = req.body.token
  if (refreshToken === null) {
    return res.sendStatus(401)
  }
  if(!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403)
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    const accessToken = generateAccessToken({user_email: user.email})
    res.json({accessToken: accessToken})
  })
})

router.delete('/logout', (req,res) => {
  refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})
module.exports = router
