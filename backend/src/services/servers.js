module.exports = (container) => container.configure(
    ({ inject }) => inject("services:servers", async ({ get }) => {
        const storage = await get("storage");
        const eventHandlers = []

        const getServers = async () => (await storage.get("servers") || { nextId: 1, servers: [] });

        const api = {
            add: async ({ name, host, user, key }) => {
                const servers = await getServers();
                const server = { name, key, host, user, id: servers.nextId }
                servers.servers.push(server);
                servers.nextId++;
                await storage.set("servers", servers)

                for (const handler of eventHandlers) {
                    handler('add', server)
                }
            },
            list: async ({ details } = { details: false }) => {
                const servers = await getServers();
                if (details) {
                    return servers.servers;
                }
                return servers.servers.map(({ key, ...rest }) => ({ ...rest }))
            },
            delete: async (_id) => {
                let servers = await getServers();
                const server = servers.servers.filter(({ id }) => id == _id)[0]
                if (!server) {
                    return;
                }
                servers.servers = servers.servers.filter(({ id }) => id != _id)
                await storage.set("servers", servers)

                for (const handler of eventHandlers) {
                    handler('delete', server)
                }
            },
            onUpdate: (handler) => {
                eventHandlers.push(handler)
            }
        }

        return api;
    })
)