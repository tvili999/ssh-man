export default {
    async me() {
        const resp = await fetch("/api/auth/me");

        return await resp.json();
    },
    async login(username: string, password: string): Promise<boolean> {
        const resp = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const json = await resp.json();

        if (json.success) return true;

        throw { message: json.message };
    },
    async logout() {},
};
