const {dataSource} = require ('../db/data-source')
const logger = require ('../utils/logger')('OrdersCotrollers')

const {
    isUndefined,
    isNotValidString,
    isNotValidInteger
} = require('../utils/validators')

const isNotValidOrder = (order) => {
    if(isUndefined(order) || !Array.isArray(order) )// 檢查order 是否為一個陣列
        {
        return true
    }
    //逐筆檢查陣列裡的每一個訂單項目
    //let index = 0：從第 0 筆開始（陣列的第一項）
    //index < order.length：跑到整個 order 陣列結束
    //如寫 index++，index 就永遠停在 0，會造成無限迴圈或只處理第一筆資料
    for( let index = 0;  index < order.length; index++ ){
        const element = order[index]
        if(
            element === undefined || !Object.prototype.hasOwnProperty.call(element, 'product_id') ||
            !Object.prototype.hasOwnProperty.call(element,'quantity') ||
            !Object.prototype.hasOwnProperty.call(element,'spec') ||
            !Object.prototype.hasOwnProperty.call(element,'colors') ||
            isNotValidString(element.products_id) ||
            isNotValidInteger(element.quantity)  ||
            isNotValidString(element.spec) ||
            isNotValidString(element.colors)
        ){
            return true
        }
    }
    return false
}    
    


const userNameReg = /^[\p{L}\p{N}]{2,50}$/u //使用者姓名格式驗證：允許2~50個字元，僅限任意語言的字母與數字（含中文字、英文、數字）
const telReg = /^09\d{8}$/ //驗證台灣手機號碼格式，09 開頭,後面必須跟著 8 個數字
const paymentMethodReg = /^[1-3]$/



// Object.prototype :JavaScript 所有物件的原型（最原始的祖先）
//.hasOwnProperty : 一個檢查屬性的函式
// .call(obj, 'key') : 手動指定這個函式要用在哪個「目標物件」上
const postOrder = async (req,res,next) => {
    try {
        const { user, orders, payment_methods: paymentMethods } = req.body
        if(isUndefined(user) || !Object.prototype.hasOwnProperty.call(user,'name') || !Object.prototype.hasOwnProperty.call(user,'tel') || !Object.prototype.hasOwnProperty.call(user,'address') || isNotValidString(user.name) || !userNameReg.test(user.name) || !Object.prototype.hasOwnProperty.call(user,'tel') || isNotValidString(user.tel) || !telReg.test(user.tel) ||!Object.prototype.hasOwnProperty.call(user,'address') || isNotValidString(user.address) ||  user.address.length > 30 || isNotValidOrder(orders) || isNotValidInteger(paymentMethods) || !paymentMethodReg.test(paymentMethods)){
            logger.warn('欄位未填寫正確')
            res.status(400).json({
                status: 'failed',
                message: '欄位未填寫正確'
            })
            return
        }
        const { id } = req.user //從登入的使用者資訊中，解構出 id
        const orderRepostory = dataSource.getRepository('order')
        const newOrder = await orderRepostory.save(orderRepostory.create({
            users_id : id,
            name: user.name,
            tel: user.tel,
            address: user.address,
            is_paid: false, // 預設「未付款」
            payment_methods_id:paymentMethods
        }))
        if(newOrder.affected===0){
            logger.warn('加入失敗')
            res.status(400).json({
                status:'failed',
                message: '加入失敗'
            })
            return
        }
        const orderLinkProductRespotory = dataSource.getRepository('order_link_products')
        const linkResult = await orderLinkProductRespotory.insert(order.map((order)=>({
            oders_id: newOrder.id,
            products_id: order.products_id,
            quantity: order.quantity,
            spec: order.spec,
            colors: order.colors
        })))
        if(linkResult.affected !== linkResult.length){
            logger.warn('加入失敗')
            await orderRepository.delete({ id: newOrder.id })
            await orderLinkProductRepository.delete({ orders_id: newOrder.id })
            res.status(400).json({
                status: 'failed',
                message: '加入失敗'
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: '加入成功'
        })
    } catch (error) {
        logger.error(error)
        next(error)
    }
}



module.exports = {
    postOrder
}