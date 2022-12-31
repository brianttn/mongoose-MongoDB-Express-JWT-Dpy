/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     src/webServer.js     ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */
const express = require("express")
const webServer = express()

const cors = require("cors")

/* = = = = = = = = = = = =   Apply Middlewares   = = = = = = = = = = = = */
/*--- 將「Content-Type：application/json」的「Request Body」parse成「JSON格式」資料 ---*/
webServer.use(express.json())
/*- 將「Content-Type：x-www-form-urlencoded」的「Request Body」parse成「String或Array」資料 -*/
webServer.use(express.urlencoded({ extended: false }))
/* - - - - - - 接受「所有的：Origins與HTTP Request Methods」 - - - - - - */
// 血淚史：cors() 寫成 cors => 「一直」找不到錯誤
webServer.use(cors())


/* = = = = = = = =   「Authorization middleware：jsonwebtoken」   = = = = = = = = */
// 「必需：寫在」「所有：Web APIs Routes之前」，以確保「路由：具有存取權限」
const auth = require("./middlewares/authJWT");
webServer.use(auth);

/* = = = = = = = = = = = = = = =     Web APIs     = = = = = = = = = = = = = = = */
/* - - - 引入「Endpoint：userRouteAPI」，並將「webServer、cors」當作「參數：傳入」 - - - */
// 血淚史：一定要寫在「有用到的：Middlewares」 => 後面
require("./routes/userRouteAPI")(webServer, cors)

webServer.get(
    "/",
    (req, res) => res.send("Welcome to User Management System.")
)

webServer.get(
    "/index",
    (req, res) => {
        res.setHeader("Content-Type", "application/json")
        res.send({ message: "Web APIs is ok!!" })
    }
)

/* = = =   Express：Error Catch(錯誤捕捉) => 「捕捉錯誤」並「進行後續的處理」   = = = */
const errors = [
    { key: 'WRONG_TOKEN', message: "TOKEN 無效" },
    { key: 'WRONG_ACCOUNT', message: "帳號錯誤" },
    { key: 'WRONG_PASSWORD', message: "密碼錯誤" },
    { key: 'DUPLICATE_ACCOUNT', message: "該帳號已被註冊" }
];

webServer.use(
    (err, req, res, next) => {
        const errorIndex = errors.findIndex(item => item.key === err.message);

        if (errorIndex > -1) {
            return res.status(401).send(
                {
                    success: false,
                    message: errors[errorIndex].message
                }
            );
        } else {
            res.status(500).send(
                {
                    success: false,
                    message: "伺服器端錯誤"
                }
            );
        }
    }
);

/* - - - - - - - - export module - - - - - - - - */
module.exports = webServer