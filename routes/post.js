const router  = require('express').Router()
const {authenticateToken} = require('../JWT/manageToken')

const posts = [
  {
    title: 'My first post',
    description: 'random data you shouldnt access',
    email: 'thisisnotmymail@gmail.com'
  },
  {
    title: 'My second post',
    description: 'random data you shouldnt access',
    email: 'thisimymail@gmail.com'
  }
]
router.get('/', authenticateToken, (req,res) => {

  res.json(posts.filter(post => post.email === req.body.email)  
  )
})

router.get('/list', authenticateToken, (_,res) => {
  
  res.json({posts})  
})

module.exports = router