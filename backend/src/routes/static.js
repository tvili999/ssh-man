const express = require("express")

module.exports = container => container.configure(
    ({ run }) => run(async ({ get }) => {
        const server = await get("server");

        server.use(express.static('static'))
    })
)