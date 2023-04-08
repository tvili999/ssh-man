module.exports = container => container.configure(
    require("./auth"),
    require("./static")
)