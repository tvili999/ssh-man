const fs = require("fs/promises")
const fsSync = require("fs")
const path = require("path")

module.exports = (container) => container.configure(
    ({ inject }) => inject("storage", async ({ get }) => {
        const config = await get("config")

        let cache = new Map()

        return {
            async get(collection) {
                if (cache.has(collection)) {
                    return cache.get(collection)
                }

                const collectionPath = path.join(config.get("storage", "./"), collection + '.json')
                if (!fsSync.existsSync(collectionPath))
                    return null;

                const data = JSON.parse(await fs.readFile(collectionPath))
                cache.set(collection, data)
                return data;
            },
            async set(collection, data) {
                cache.delete(collection)

                const collectionPath = path.join(config.get("storage", "./"), collection + '.json')
                await fs.writeFile(collectionPath, JSON.stringify(data))
                cache.set(collection, data)
            }
        }
    })
)