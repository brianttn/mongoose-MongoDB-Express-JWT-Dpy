/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     src/app.js     ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */
/* = = = = = include 「module：mongoose」 & 連線到MongoDB的「database：demo」 = = = = = */
const mongoose = require('./db/mongooseConnectMongoDB')

/* - - - - - 持續不斷確認(監聽) =>「已取得連線資料庫：demo」的連線狀態 - - - - - */
const currDB = mongoose.connection      // 「目前(current)：已取得連線」的資料庫

currDB.on(
    "connected",
    () => console.log("MongoDB is Online!!")
)

currDB.on(
    "disconnected",
    () => console.log("MongoDB is Offline!!")
)

currDB.on(
    "error",
    err => console.error("MongoDB Error!!", err)
)

/* = = = = = = = =   建立：Express Web Server Application   = = = = = = = = */
const app = require("./webServer")      // include 「module：webServer.js」
const port = process.env.PORT || 3000

/* - - - Launch the server and listen on  port - - - */
app.listen(
    port,
    err => err ? console.log("Server error!!") : console.log(`Server running at http://127.0.0.1:${port}/`)
)