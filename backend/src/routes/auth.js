module.exports = container => container.configure(
    ({ run }) => run(async ({ get }) => {
        const server = await get("server");

        server.get("/api/me", async (req, res) => {
            res.send("asd")
        })
    })
)