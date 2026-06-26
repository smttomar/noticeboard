export const CATEGORIES = ["Exam", "Event", "General"];
export const PRIORITIES = ["Normal", "Urgent"];

export const noticeOrderBy = [{ priority: "desc" }, { eventDate: "desc" }];

function normalizeOptionalString(value) {
    return typeof value === "string" ? value.trim() : "";
}

export function validateNoticeInput(input = {}) {
    const errors = {};
    const title = normalizeOptionalString(input.title);
    const body = normalizeOptionalString(input.body);
    const category = input.category || "General";
    const priority = input.priority || "Normal";
    const eventDate = input.eventDate ? new Date(input.eventDate) : null;
    const imageUrl = normalizeOptionalString(input.imageUrl);

    if (!title) {
        errors.title = "Title is required.";
    }

    if (!body) {
        errors.body = "Body is required.";
    }

    if (!eventDate || Number.isNaN(eventDate.getTime())) {
        errors.eventDate = "A valid event date is required.";
    }

    if (!CATEGORIES.includes(category)) {
        errors.category = "Category must be Exam, Event, or General.";
    }

    if (!PRIORITIES.includes(priority)) {
        errors.priority = "Priority must be Normal or Urgent.";
    }

    if (imageUrl) {
        try {
            const parsedUrl = new URL(imageUrl);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                errors.imageUrl = "Image URL must start with http or https.";
            }
        } catch {
            errors.imageUrl = "Please enter a valid image URL.";
        }
    }

    if (Object.keys(errors).length > 0) {
        return { errors, data: null };
    }

    return {
        errors: null,
        data: {
            title,
            body,
            category,
            priority,
            eventDate,
            imageUrl: imageUrl || null,
        },
    };
}

export function isRecordNotFound(error) {
    return error?.code === "P2025";
}
