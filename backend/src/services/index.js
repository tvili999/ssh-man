module.exports = container => container.configure(
    require("./tokens.js"),
    require("./auth.js"),
    require("./servers.js"),
    require("./keys.js"),
    require("./keyManager")
)