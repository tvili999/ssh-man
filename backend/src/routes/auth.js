const cookie = require("cookie");

module.exports = container => container.configure(
    ({ run }) => run(async ({ get }) => {
        const server = await get("server");
        const config = await get("config");
        const auth = await get("services:auth");

        server.get("/api/auth/me", async (req, res) => {
            res.send({
                loggedIn: await auth.checkToken(req.cookies?.token)
            })
        })

        server.post("/api/auth/login", async (req, res) => {
            const token = await auth.login(req.body.username, req.body.password)
            if (!token) {
                res.send({
                    success: false,
                    message: "Wrong username or password"
                })
                return
            }
            res.setHeader("Set-Cookie", cookie.serialize("token", token, {
                maxAge: 60 * 60 * 24 * 30,
                secure: config.get("mode", "dev") == "prod",
                httpOnly: true,
                sameSite: 'strict',
                path: '/'
            }))
            res.send({ success: true })
        })

        server.post("/api/auth/logout", async (req, res) => {
            res.setHeader("Set-Cookie", cookie.serialize("token", null, {
                maxAge: -1,
                secure: config.get("mode", "dev") == "prod",
                httpOnly: true,
                sameSite: 'strict',
                path: '/'
            }))
            res.send({ success: true })
        })
    })
)