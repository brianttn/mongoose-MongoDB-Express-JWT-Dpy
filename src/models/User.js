const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

/* = = = = =   使用「mongoose：Schema」建立 => userSchema   = = = = =
1. 映射(Map)到MongoDB的「collection：User」
2. 定義：「collection：User」裡「documents」的「結構組成」
*/
const userSchema = new mongoose.Schema(
    {
        account: {
            type: String,       // Data Type
            /* - - - 設置：「必填欄位」與「錯誤訊息」 - - - */
            required: [true, 'User account is required.'],
            trim: true,         // 設置：「清除前後的空格」
            unique: true,       // 設置：「唯一值」
            /* - - - 設置：「最小長度」與「錯誤訊息」 - - - */
            minLength: [6, "帳號需至少：6個字元  以上"]
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            trim: true,
            minLength: [6, "密碼需至少：6個字元  以上"],
            maxLength: 255,
            /* - - - 設置：「Validator(驗證器)」與「錯誤訊息」 - - - */
            validate(param) {
                if (param.toLowerCase().includes("123456")) {
                    throw new Error("密碼不可以是：123456!!");
                }
            }
        },
        authority: {
            type: Number,
            required: true
        }
    },
    {
        /* - - - 設置：存取的document是否要有「createdAt」與「updatedAt」時間 - - - */
        timestamps: true
    }
);

/* - - - 新增：User Schema 「Instance」 Method：getAccount() - - - */
userSchema.method(
    "getAccount",
    function () {
        return this.account
    }
)

/* - - - 新增：User Schema 「Instance」 Method：getAuthority() - - - */
userSchema.methods.getAuthority = function () { return this.authority }

/* - - - 新增：User Schema 「Instance」 Method：generateAuthToken() - - - */
// 產生：token
userSchema.methods.generateAuthToken = async function () {
    const currUser = this;      // this：「當前使用者」Instance

    /* - - - 使用「payload、secretKey」來產生「效期：24小時」的token - - - */
    const secretKey = process.env.JWT_SECRETKEY
    const payload = { account: this.account, _id: currUser._id.toString() };
    const token = jwt.sign(
        payload,
        secretKey,
        { expiresIn: '24h' }
    );

    return token;       // 回傳 token
}

/* = = = = =   使用「mongoose：model()」建立 => userConstructor   = = = = =
1. mongoose.model()協同「collectionSchema的copy」建立 => MongoDB的「document Constructor物件」
2. 「document Constructor物件」的「Instance(實例)」可用來「操作：MongoDB裡的documents」
*/
// mongoose.model()在MongoDB建立的「collection名稱」會自行轉為「複數, 小寫字母」型式
// 所以實際上在MongoDB上建立的「collection名稱」會是「users」
const userConstructor = mongoose.model('User', userSchema)

/* - - - Export：document Constructor物件 - - - */
module.exports = userConstructor