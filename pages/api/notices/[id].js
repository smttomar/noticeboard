import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: "Invalid notice ID" });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!notice) return res.status(404).json({ error: "Notice not found" });
      return res.status(200).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch notice" });
    }
  }

  if (req.method === "PUT") {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // Server-side validation
    const errors = {};
    if (!title || title.trim() === "") errors.title = "Title is required.";
    if (!body || body.trim() === "") errors.body = "Body is required.";
    if (!publishDate || isNaN(new Date(publishDate).getTime())) {
      errors.publishDate = "A valid publish date is required.";
    }
    if (!["Exam", "Event", "General"].includes(category)) {
      errors.category = "Category must be Exam, Event, or General.";
    }
    if (!["Normal", "Urgent"].includes(priority)) {
      errors.priority = "Priority must be Normal or Urgent.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors });
    }

    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: "Notice not found" });

      const updated = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl || null,
        },
      });
      return res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update notice" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: "Notice not found" });

      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete notice" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
