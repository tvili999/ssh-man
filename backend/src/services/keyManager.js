const childProcess = require("child_process")
const fs = require("fs")

module.exports = (container) => container.configure(
    ({ run }) => run(async ({ get }) => {
        const keys = await get("services:keys");
        const servers = await get("services:servers");

        const execSSH = async (server, command) => {
            fs.writeFileSync("ssh_key", server.key);
            fs.chmodSync("ssh_key", '0600');

            const proc = childProcess.spawn("/usr/bin/ssh", [
                "-i", "ssh_key",
                '-o', 'StrictHostKeyChecking=no',
                `${server.user}@${server.host}`,
                command
            ])

            return await new Promise((resolve, reject) => {
                let stdout = "";
                let stderr = "";
                proc.stdout.on("data", (data) => {
                    stdout += data.toString('ascii')
                })
                proc.stderr.on("data", (data) => {
                    stderr += data.toString('ascii')
                })
                proc.on("exit", (code) => {
                    if (code == 0) resolve({ stdout, stderr })
                    else reject({ stdout, stderr, code })
                })
            })
        }

        const readKeys = async (server) => {
            return await execSSH(server, `
            mkdir -p $HOME/.ssh
            if [ ! -e $HOME/.ssh/authorized_keys ]; then
                touch $HOME/.ssh/authorized_keys
                chmod 0600 $HOME/.ssh/authorized_keys
            fi

            cat $HOME/.ssh/authorized_keys
            `)
        }

        const updateKeys = async (server, key) => {
            return await execSSH(server, `
            mkdir -p $HOME/.ssh
            if [ ! -e $HOME/.ssh/authorized_keys ]; then
                touch $HOME/.ssh/authorized_keys
                chmod 0600 $HOME/.ssh/authorized_keys
            fi

            echo "${Buffer.from(key).toString('base64')}" | base64 -d > $HOME/.ssh/authorized_keys
            `)
        }

        const rsaRegex = /^ssh-rsa (?<key>[^ ]+).*$/;
        const updateKeyFile = (file, keys) => {
            const knownKeys = []
            const SIG = " # created by ssh_man"
            const filteredLines = file.trim()
                .split('\n')
                .filter(x => !x.endsWith(SIG));

            filteredLines
                .map(x => rsaRegex.exec(x))
                .filter(x => x)
                .map(x => x.groups.key)
                .forEach(x => knownKeys.push(x))

            const newLines = []
            for (const key of keys) {
                const match = rsaRegex.exec(key.key)
                if (!match) continue

                if (knownKeys.includes(match.groups.key)) {
                    continue
                }

                newLines.push(key.key.trim())
            }

            return [...filteredLines, ...newLines, ''].join('\n')
        }

        const update = async () => {
            const serverList = await servers.list({ details: true });
            const keyList = await keys.list({ details: true })
            for (const server of serverList) {
                const keysFile = await readKeys(server);

                const newKeys = updateKeyFile(keysFile.stdout, keyList)

                await updateKeys(server, newKeys)
            }
        }

        keys.onUpdate(() => {
            update()
        })
        servers.onUpdate(() => {
            update()
        })

        await update();
    })
)