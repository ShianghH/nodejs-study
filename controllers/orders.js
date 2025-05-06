const {dataSource} = require ('../db/data-source')
const logger = require ('../utils/logger')('OrdersCotrollers')

const {
    isUndefined,
    isNotValidString,
    isNotValidInteger
} = require('../utils/validators')


const postOrder = async (req,res,next) => {
    
}



module.exports = {
    postOrder
}