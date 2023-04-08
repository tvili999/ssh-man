module.exports = (container) => container.configure(
    require("./core"),
    require("./services"),
    require("./routes")
)