const {dataSource} = require('../db/data-source')// 用來對資料庫做查詢、存取等操作
const logger = require('../utils/logger')('Users')// 建立 logger 實例，標記這份 log 是來自 UsersController
const config = require('../config/index') // 引入自訂的設定管理器，集中管理 db/web/secret 等設定
const bcrypt = require('bcrypt')// 引入 bcrypt 套件，用來加密密碼（雜湊處理）
const generateJWT = require('../utils/generateJWT')// 引入自訂的 JWT 產生器，用來簽發登入後的 JSON Web Token
const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/ // 密碼格式規則：需包含至少一個數字、一個大寫、一個小寫，長度 8-16 字元

// Email 格式驗證規則：
// 必須包含帳號@網域，帳號允許英數字 + 特定符號，網域支援 .com / .org 等結尾
const emailPattern = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
const {
  isUndefined,
  isNotValidString,
  isNotValidInteger
} = require('../utils/validators')


const postSignup = async (req,res,next) =>{
  try {
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/
    // 從請求主體中解構取得使用者輸入的 name、email、password 欄位
    const {name,email,password} = req.body 
    if (isUndefined(name) || isNotValidSting(name) || name.trim().length > 10 ||name.trim().length < 2 || isUndefined(email) || isNotValidString(email) || isUndefined(password) ||isNotValidSting(password)){
      logger.warn('欄位未填寫正確')
      res.status(400).json({
        status: 'failed',

      })
    }
  } catch (error) {
    
  }
}




module.exports = postSignup
