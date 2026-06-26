import prisma from "../../../lib/prisma";
import { getRoleFromRequest, isAdminRole } from "../../../lib/auth";
import { noticeOrderBy, validateNoticeInput } from "../../../lib/notices";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const notices = await prisma.notice.findMany({
                orderBy: noticeOrderBy,
            });

            return res.status(200).json(notices);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch notices" });
        }
    }

    if (req.method === "POST") {
        const role = getRoleFromRequest(req);

        if (!isAdminRole(role)) {
            return res.status(403).json({ error: "Admin access required" });
        }

        const { errors, data } = validateNoticeInput(req.body);

        if (errors) {
            return res.status(422).json({ errors });
        }

        try {
            const notice = await prisma.notice.create({ data });
            return res.status(201).json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to create notice" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
