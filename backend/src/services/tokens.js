module.exports = (container) => container.configure(
    ({ inject }) => inject("services:tokens", async () => {
        return {
            hash: async (username) => username,
            check: async (token, username) => token == username
        }
    })
)