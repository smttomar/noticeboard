import prisma from "../../../lib/prisma";
import { getRoleFromRequest, isAdminRole } from "../../../lib/auth";
import { isRecordNotFound, validateNoticeInput } from "../../../lib/notices";

export default async function handler(req, res) {
    const { id } = req.query;
    const noticeId = Number(Array.isArray(id) ? id[0] : id);

    if (!Number.isInteger(noticeId) || noticeId < 1) {
        return res.status(400).json({ error: "Invalid notice ID" });
    }

    const role = getRoleFromRequest(req);

    if (
        (req.method === "PUT" || req.method === "DELETE") &&
        !isAdminRole(role)
    ) {
        return res.status(403).json({ error: "Admin access required" });
    }

    if (req.method === "GET") {
        try {
            const notice = await prisma.notice.findUnique({
                where: { id: noticeId },
            });

            if (!notice) {
                return res.status(404).json({ error: "Notice not found" });
            }

            return res.status(200).json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch notice" });
        }
    }

    if (req.method === "PUT") {
        const { errors, data } = validateNoticeInput(req.body);

        if (errors) {
            return res.status(422).json({ errors });
        }

        try {
            const updated = await prisma.notice.update({
                where: { id: noticeId },
                data,
            });

            return res.status(200).json(updated);
        } catch (error) {
            if (isRecordNotFound(error)) {
                return res.status(404).json({ error: "Notice not found" });
            }

            console.error(error);
            return res.status(500).json({ error: "Failed to update notice" });
        }
    }

    if (req.method === "DELETE") {
        try {
            await prisma.notice.delete({
                where: { id: noticeId },
            });

            return res.status(200).json({ message: "Deleted successfully" });
        } catch (error) {
            if (isRecordNotFound(error)) {
                return res.status(404).json({ error: "Notice not found" });
            }

            console.error(error);
            return res.status(500).json({ error: "Failed to delete notice" });
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
