const {dataSource} = require ('../db/data-source')
const logger = require ('../utils/logger')('OrdersCotrollers')

const {
    isUndefined,
    isNotValidString,
    isNotValidInteger
} = require('../utils/validators')

const isNotValidOrder = (value) =>    
    value === undefined  ;


const userNameReg = /^[\p{L}\p{N}]{2,50}$/u //使用者姓名格式驗證：允許2~50個字元，僅限任意語言的字母與數字（含中文字、英文、數字）
const telReg = /^09\d{8}$/ //驗證台灣手機號碼格式，09 開頭,後面必須跟著 8 個數字
// Object.prototype :JavaScript 所有物件的原型（最原始的祖先）
//.hasOwnProperty : 一個檢查屬性的函式
// .call(obj, 'key') : 手動指定這個函式要用在哪個「目標物件」上
const postOrder = async (req,res,next) => {
    try {
        const { user, orders, payment_methods: paymentMethods } = req.body
        if(isUndefined(user) || !Object.prototype.hasOwnProperty.call(user,'name') || !Object.prototype.hasOwnProperty.call(user,'tel') || !Object.prototype.hasOwnProperty.call(user,'address') || isNotValidString(user.name) || !userNameReg.test(user.name) || !Object.prototype.hasOwnProperty.call(user,'tel') || isNotValidString(user.tel) || !telReg.test(user.tel) ||!Object.prototype.hasOwnProperty.call(user,'address') || isNotValidString(user.address) ||  user.address.length > 30 ){
            logger.warn('欄位未填寫正確')
            res.status(400).json({
                status: 'failed',
                message: '欄位未填寫正確'
            })
            return
        }
    } catch (error) {
        logger.error(error)
        next(error)
    }
}



module.exports = {
    postOrder
}