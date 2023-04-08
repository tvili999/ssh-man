const fs = require("fs")
const path = require("path");
const process = require("process");

const toSnake = (text) => text
    .replaceAll(/([A-Z])/g, "_$1")
    .split('_')
    .filter(x => x)
    .map(x => x.toUpperCase())
    .join('_')


module.exports = (container) => container.configure(
    ({ inject }) => inject("config", async () => {
        const configFilePath = path.resolve("./config.json");

        let configFile = null;
        if (fs.existsSync(configFilePath)) {
            const configFileRaw = fs.readFileSync(configFilePath);
            configFile = JSON.parse(configFileRaw)
        }

        return {
            get: (key, defaultValue) => process.env[toSnake(key)] || configFile[key] || defaultValue
        }

    })
)