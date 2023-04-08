module.exports = (container) => container.configure(
    require("./core"),
    require("./routes")
)