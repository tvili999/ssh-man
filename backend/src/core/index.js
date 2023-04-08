module.exports = (container) => container.configure(
    require("./server"),
    require("./config"),
    require("./storage")
)