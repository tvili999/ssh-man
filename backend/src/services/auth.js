module.exports = (container) => container.configure(
    ({ inject }) => inject("services:auth", async ({ get }) => {
        const config = await get("config");
        const storage = await get("storage");
        const tokens = await get("services:tokens");

        const authStorage = await storage.get("auth");

        const username = authStorage?.username || config.get("username", "admin")
        const password = authStorage?.password || config.get("password", "admin")

        const api = {
            login: async (_username, _password) => {
                if (username == _username && password == _password)
                    return await tokens.hash(username);
                return false
            },
            check: async (token) => {
                return await tokens.check(token, username)
            },
            checkToken: async (token) => {
                return token == username;
            },
            authenticated: async (req, res, next) => {
                if (!await api.checkToken(req.cookies?.token)) {
                    return res.status(403).send({
                        error: "Unauthorized"
                    })
                }

                next()
            }
        }

        return api;
    })
)