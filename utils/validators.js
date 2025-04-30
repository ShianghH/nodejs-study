// 檢查傳入的值是否為 undefined（尚未被定義）
const isUndefined = (value) => value === undefined; 


// 判斷傳入的值是否為無效字串：
// 不是字串類型、空字串、或只包含空白都會被視為無效
const isNotValidString = (value) => {
    return typeof value !== 'string' || value.trim().length === 0 || value === '';
};


// 判斷傳入的值是否為無效整數：
// 若非數字型別、為負數、或不是整數（小數）皆視為無效
const isNotValidInteger = (value) =>{
    return typeof value !== 'number' || value < 0 || value % 1 !== 0;
}

module.exports = {
    isUndefined,
    isNotValidString,
    isNotValidInteger
}