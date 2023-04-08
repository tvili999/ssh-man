const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");

module.exports = (container) => container.configure(
    ({ inject }) => inject("server", async ({ get }) => {
        const server = express()

        server.use(bodyParser.json())
        server.use(morgan('dev'))

        return server;
    }),
    ({ run }) => run(async ({ get }) => {
        const config = await get("config")
        const server = await get("server")

        server.listen(config.get("serverPort", 8000))
    })
)