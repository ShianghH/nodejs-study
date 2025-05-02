const express = require('express')
const router = express.Router()

const {
    postSignup,
    postSignin

} = require('../controllers/users')
// const config = require('../config/index')
// const { dataSource } = require('../db/data-source')
// const logger = require('../utils/logger')('Users')
// const auth = require('../middlewares/auth')({
//   secret: config.get('secret').jwtSecret,
//   userRepository: dataSource.getRepository('users'),
//   logger
// })

router.post('/signup',postSignup)
router.post('/signin',postSignin)

module.exports = router
