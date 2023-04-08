module.exports = container => container.configure(
    require("./auth"),
    require("./keys"),
    require("./static"),
    require("./servers")
)