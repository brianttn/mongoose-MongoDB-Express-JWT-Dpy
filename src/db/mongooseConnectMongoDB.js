/* ~ ~ ~ ~ ~ ~ ~ ~ ~   src/db/mongooseConnectMongoDB.js   ~ ~ ~ ~ ~ ~ ~ ~ ~ */
const mongoose = require('mongoose')

/* = = = = = = = =   連線到MongoDB的「database：jwtTest」   = = = = = = = = */
const mongodbPwd = process.env.MONGODB_PASSWORD
const dataBase = 'jwtTest';

/*--- 使用IIFE時，記得「上一個：statement」的「結尾」一定要加「;」 ---*/
(
    async () => {
        try {
            await mongoose.connect(`mongodb+srv://brianttn:${mongodbPwd}@cluster0.yexhqjq.mongodb.net/${dataBase}?retryWrites=true&w=majority`)
            console.log(`Database：${dataBase} is connected!!`)
        } catch (err) {
            console.error("Database connection error!!", err)
        }
    }
)()

/* - - - - - - - - export module - - - - - - - - */
module.exports = mongoose