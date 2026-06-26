import prisma from "../../../lib/prisma";
import { setRoleCookie } from "../../../lib/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, password } = req.body;
    const normalizedEmail =
        typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required" });
    }

    if (!process.env.ADMIN_LOGIN_PASSWORD) {
        return res.status(500).json({
            error: "Admin login is not configured. Set ADMIN_LOGIN_PASSWORD.",
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        const isAdmin =
            user?.role === "admin" &&
            password === process.env.ADMIN_LOGIN_PASSWORD;

        if (!isAdmin) {
            return res
                .status(401)
                .json({ error: "Invalid admin credentials" });
        }

        setRoleCookie(res, "admin");
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to sign in" });
    }
}
