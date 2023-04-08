const cookie = require("cookie");

module.exports = container => container.configure(
    ({ run }) => run(async ({ get }) => {
        const server = await get("server");
        const auth = await get("services:auth");
        const keys = await get("services:keys");

        server.get("/api/keys", auth.authenticated, async (req, res) => {
            res.send(await keys.list())
        })

        server.post("/api/keys", auth.authenticated, async (req, res) => {
            await keys.add(req.body);
            res.send({ success: true })
        })

        server.delete("/api/keys/:id", auth.authenticated, async (req, res) => {
            await keys.delete(req.params.id)
            res.send({ success: true })
        })
    })
)