const cookie = require("cookie");

module.exports = container => container.configure(
    ({ run }) => run(async ({ get }) => {
        const server = await get("server");
        const auth = await get("services:auth");
        const servers = await get("services:servers");

        server.get("/api/servers", auth.authenticated, async (req, res) => {
            res.send(await servers.list())
        })

        server.post("/api/servers", auth.authenticated, async (req, res) => {
            await servers.add(req.body);
            res.send({ success: true })
        })

        server.delete("/api/servers/:id", auth.authenticated, async (req, res) => {
            await servers.delete(req.params.id)
            res.send({ success: true })
        })
    })
)