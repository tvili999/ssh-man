export default {
    list: async () => {
        const resp = await fetch("/api/servers");
        const json = await resp.json();

        return json;
    },
    add: async ({ name, host, user, key }: { name: string; host: string; user: string; key: string }) => {
        const resp = await fetch("/api/servers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, host, user, key }),
        });
        const json = await resp.json();

        return json;
    },
    delete: async (id: string) => {
        const resp = await fetch(`/api/servers/${id}`, { method: "DELETE" });
        const json = await resp.json();

        return json;
    },
};
