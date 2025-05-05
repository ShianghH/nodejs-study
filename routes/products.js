const express = require ('express')
const router = express.Router()
const {
    getProducts,
    getProductDtailtail
} = require('../controllers/products')

router.get('/', getProducts)
router.get('/:products_id', getProductDtailtail)

module.exports = router