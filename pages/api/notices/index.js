import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "desc" }, // Urgent > Normal (desc alphabetically: U > N)
          { publishDate: "desc" },
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
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
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl || null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create notice" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
