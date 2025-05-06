const express = require('express')
const router = express.Router

const {
    postOrder
} = require ('../controllers/orders')


router.post('/', postOrder)









module.exports = router