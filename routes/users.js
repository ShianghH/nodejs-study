const express = require('express')

const usersController = require('../controllers/users')
const router = express.Router()
// const config = require('../config/index')
// const { dataSource } = require('../db/data-source')
// const logger = require('../utils/logger')('Users')
// const auth = require('../middlewares/auth')({
//   secret: config.get('secret').jwtSecret,
//   userRepository: dataSource.getRepository('users'),
//   logger
// })

router.post('/signup',postSignup)

module.exports = router
