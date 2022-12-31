const jwt = require("jsonwebtoken");
/* - - - 引入 => 「Model：userConstructor」 - - - */
const userConstructor = require("../models/User");

module.exports = async (req, res, next) => {
    // 「首頁、註冊、登入」這4個Web API Routes => 不需要：token
    if (['/', '/index', '/register', '/login'].includes(req.url)) {
        next();
    } else {
        try {
            // 從Request headers中的「Authorization」取得「Json Web Token」
            let token = req.headers.authorization;

            // Request headers中「存在：token」
            if (token) {
                // Request headers中的「Authorization」，需將「前面的："Bearer "」去掉，才是token
                token = token.replace("Bearer ", "");

                /* - - - - - -   驗證：是否為「有效的」token   - - - - - - */
                const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

                // 查詢：payload中「指定：_id與account」的使用者，「是否存在：資料庫」中
                const currUser = await userConstructor.findOne(
                    {
                        _id: decoded._id,
                        account: decoded.account,
                    }
                );

                /* - - - - - - 如果：「找不到」該使用者 - - - - - - */
                if (!currUser) {
                    /* --- 丟出「Error Key(Type)：WRONG_TOKEN」讓Express Error Catch Middleware進行捕捉 --- */
                    throw new Error('WRONG_TOKEN');     // 無效的：token
                } else {
                    next();                             // 有效的：token
                }
            } else {
                throw new Error('WRONG_TOKEN');     // Request headers中「不存在：token」
            }
        } catch (err) {
            res.status(403).send(
                {
                    success: false,
                    message: `您無權進行此操作 => ${err}`
                }
            );
        }
    }
};