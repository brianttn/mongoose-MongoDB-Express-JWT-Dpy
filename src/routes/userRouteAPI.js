/* ~ ~ ~ ~ ~ ~ ~ ~ ~     routes/routeUser.js     ~ ~ ~ ~ ~ ~ ~ ~ ~ */
const bcrypt = require("bcrypt");
/* - - - - - 引入 => 「Model：userConstructor」 - - - - - */
const userConstructor = require("../models/User");

const userRouteAPI = (app, cors) => {
    /* = = = = = = 「註冊：新使用者」 => 「Method：POST」、「Route：/register」 = = = = = = */
    app.post(
        "/register",
        async (req, res, next) => {
            try {
                /* = = = = = = 將使用者輸入的「密碼：進行加密」 = = = = = = */
                const hashPwd = await bcrypt.hash(req.body.password, 10)    // 「非同步」寫法
                // const hashPwd = bcrypt.hashSync(req.body.password, 10)   // 「同步」寫法

                /*--- 將「hashPwd」設為 => 「物件：req.body」中「屬性：password」的「值」 ---*/
                // 使用「Spread運算子：...」 => 「合併：物件」
                const encryptedDataObj = { ...req.body, password: hashPwd }

                /* = = = = = = 建立一個：Instance(實例) = = = = = = */
                const newUser = new userConstructor(encryptedDataObj);

                /* - - - - - - - - 創建：token - - - - - - - - */
                const token = await newUser.generateAuthToken();

                /* = = = 將「Instance資料：newUser、token」「新增並儲存」到「MongoDB」 = = = */
                /* - - - - - - - - async/await寫法 - - - - - - - - */
                await newUser.save().catch(
                    (err) => {
                        /* - - - - - - - - Database中已有相同帳號 - - - - - - - - */
                        if (err.code === 11000)
                            /* --- 丟出「Error Key(Type)：DUPLICATE_ACCOUNT」讓Express Error Catch Middleware進行捕捉 --- */
                            throw new Error("DUPLICATE_ACCOUNT");
                        else
                            throw new Error(err);
                    }
                );

                res.send({ newUser, token })

                /* - - - - - - - - callback寫法 - - - - - - - - */
                // newUser.save(
                //     (err, result) => err ? res.status(404).send(err) : res.send({ result, token })
                // )
            } catch (err) {
                next(err);
            }
        }
    )

    /* = = = = = = 「使用者：登入」 => 「Method：POST」、「Route：/login」 = = = = = = */
    app.post(
        "/login",
        async (req, res, next) => {
            try {
                const { account, password } = req.body;

                /* - - - 驗證：「帳號、密碼」是否正確 - - - */
                const currUser = await userConstructor.findByCredentials(account, password);

                /* - - - 產生：該使用者「專屬的token」 - - - */
                const token = await currUser.generateAuthToken();

                /* - - - 回傳：「使用者資料、專屬token」 - - - */
                res.send({ currUser, token });
            } catch (err) {
                next(err);
            }
        }
    );

    /* - - - 「取得：使用者列表」 => 「Method：GET」、「Route：/user/list」 - - - */
    app.get(
        "/user/list",
        (req, res) => {
            userConstructor.find(
                {},
                (err, doc) => {
                    if (err) res.status(404).send(err);
                    res.send(doc);
                }
            );
        }
    );

    /* = = = = = = 「更新：使用者資料」 => 「Method：PUT」、「Route：/user」 = = = = = = */
    app.put(
        "/user",
        (req, res) => {
            // Destructuring Assignment(解構賦值)：將「物件：req.query」的「屬性：account」的「值」取出
            const { account } = req.query
            const filterDoc = req.query;    // filter document：指定「搜尋條件」
            const update = req.body;        // 用來：進行更新(修改)的內容

            /* - - - 確認「帳號名稱」不會被修改 => 「屬性：account」「不可」在「修改內容內」 - - - */
            if ("account" in req.body) {
                res.status(403).send(
                    {
                        success: false,
                        message: "無法修改帳號名稱!!"
                    }
                );
            } else {
                /* - - - - - - 「尋找：該使用者」並修改其資料 - - - - - - */
                userConstructor.updateOne(
                    filterDoc,
                    update,
                    (err, doc) => {
                        if (err)
                            res.status(404).send(err);

                        /* - - - 找不到：該使用者 - - - */
                        if (!doc.matchedCount) {
                            res.status(404).send(
                                {
                                    success: false,
                                    message: `使用者：${account} => 不存在!!`
                                }
                            );
                        } else {
                            res.send(
                                {
                                    success: true,
                                    message: `使用者：${account} => 資料修改成功!!`
                                }
                            );
                        }
                    }
                );
            }
        }
    );

    /* = = = = = =  「刪除：使用者」 => 「Method：DELETE」、「Route：/user」  = = = = = = */
    app.delete(
        "/user",
        (req, res) => {
            // 使用Destructuring Assignment：將「物件：req.query」的「屬性物件：{account}」取出
            const { account } = req.query;

            /* - - - - - - 「尋找：該使用者」並將其刪除 - - - - - - */
            userConstructor.deleteOne(
                { account },        // 屬性物件：{account}
                (err, doc) => {
                    if (err) res.status(404).send(err);

                    /* - - - 找不到：該使用者 - - - */
                    if (!doc.deletedCount) {
                        res.status(404).send(
                            {
                                success: false,
                                message: `使用者：${account} => 不存在!!`
                            }
                        );
                    } else {
                        res.send(
                            {
                                success: true,
                                message: `使用者：${account} => 已被刪除！!`
                            }
                        );
                    }
                }
            );
        }
    );
}

module.exports = userRouteAPI