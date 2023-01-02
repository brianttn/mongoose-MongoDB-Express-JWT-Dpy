/* ~ ~ ~ ~ ~ ~ ~ ~ ~   src/db/mongooseConnectMongoDB.js   ~ ~ ~ ~ ~ ~ ~ ~ ~ */
const mongoose = require('mongoose')

/* = = = = = = = =   連線到Railway上的MongoDB：無法設定「預設Database」   = = = = = = = = */
const mongodbPwd = process.env.MONGODB_PASSWORD;

/*--- 使用IIFE時，記得「上一個：statement」的「結尾」一定要加「;」 ---*/
(
    async () => {
        try {
            await mongoose.connect(`mongodb://mongo:${mongodbPwd}@containers-us-west-17.railway.app:6458`)
        } catch (err) {
            console.error("Database connection error!!", err)
        }
    }
)()

/* - - - - - - - - export module - - - - - - - - */
module.exports = mongoose