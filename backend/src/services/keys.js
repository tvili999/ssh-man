module.exports = (container) => container.configure(
    ({ inject }) => inject("services:keys", async ({ get }) => {
        const storage = await get("storage");
        const eventHandlers = []

        const getKeys = async () => (await storage.get("keys") || { nextId: 1, keys: [] });

        const api = {
            add: async ({ name, key }) => {
                const keys = await getKeys();
                const entry = { name, key, id: keys.nextId }
                keys.keys.push(entry);
                keys.nextId++;
                await storage.set("keys", keys)

                for (const handler of eventHandlers) {
                    handler('add', entry)
                }
            },
            list: async ({ details } = { details: false }) => {
                const keys = await getKeys();
                if (details) {
                    return keys.keys;
                }
                return keys.keys.map(({ key, ...rest }) => ({ ...rest }))
            },
            delete: async (_id) => {
                let keys = await getKeys();
                const key = keys.keys.filter(({ id }) => id == _id)[0]
                if (!key) {
                    return;
                }
                keys.keys = keys.keys.filter(({ id }) => id != _id)
                await storage.set("keys", keys)

                for (const handler of eventHandlers) {
                    handler('delete', key)
                }

            },
            onUpdate: (handler) => {
                eventHandlers.push(handler)
            }
        }

        return api;
    })
)