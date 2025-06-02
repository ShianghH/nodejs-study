const express = require('express')
// 建立一個路由模組實例，用來掛載對應的 HTTP 方法（GET、POST 等）
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
//test
// })

router.post('/signup',postSignup)
router.post('/signin',postSignin)

module.exports = router
