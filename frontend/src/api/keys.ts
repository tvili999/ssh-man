export default {
    list: async () => {
        const resp = await fetch("/api/keys");
        const json = await resp.json();

        return json;
    },
    add: async ({ name, key }: { name: string; key: string }) => {
        const resp = await fetch("/api/keys", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, key }),
        });
        const json = await resp.json();

        return json;
    },
    delete: async (id: string) => {
        const resp = await fetch(`/api/keys/${id}`, { method: "DELETE" });
        const json = await resp.json();

        return json;
    },
};
