import { useState } from "react";
import { useRouter } from "next/router";
import { FaMoon, FaSpinner, FaSun } from "react-icons/fa";

export default function NoticeForm({
    initialData,
    noticeId,
    theme = "light",
    toggleTheme,
}) {
    const router = useRouter();
    const isEditing = Boolean(noticeId);
    const isDark = theme === "dark";

    const toDateInputValue = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return "";
        return d.toISOString().split("T")[0];
    };

    const [form, setForm] = useState({
        title: initialData?.title || "",
        body: initialData?.content || initialData?.body || "",
        category: initialData?.category || "General",
        priority: initialData?.priority || "Normal",
        eventDate: toDateInputValue(initialData?.eventDate) || "",
        imageUrl: initialData?.imageUrl || "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [navigatingHome, setNavigatingHome] = useState(false);
    const isBusy = submitting || navigatingHome;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.title.trim()) {
            nextErrors.title = "Title is required.";
        }

        if (!form.body.trim()) {
            nextErrors.body = "Body is required.";
        }

        if (!form.eventDate) {
            nextErrors.eventDate = "Event date is required.";
        }

        if (form.eventDate) {
            const selectedDate = new Date(form.eventDate);
            const today = new Date();

            // Compare only the date part
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                nextErrors.eventDate = "Past dates are not allowed.";
            }
        }

        if (
            form.imageUrl.trim() &&
            !/^https?:\/\/.+/i.test(form.imageUrl.trim())
        ) {
            nextErrors.imageUrl = "Please enter a valid URL.";
        }

        return nextErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        setErrors({});

        const url = isEditing ? `/api/notices/${noticeId}` : "/api/notices";
        const method = isEditing ? "PUT" : "POST";

        try {
            const payload = {
                ...form,
                title: form.title.trim(),
                body: form.body.trim(),
                imageUrl: form.imageUrl.trim(),
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.status === 422 && data.errors) {
                setErrors(data.errors);
                return;
            }

            if (!res.ok) {
                setErrors({
                    _global:
                        data.error || "Something went wrong. Please try again.",
                });
                return;
            }

            await router.push("/");
        } catch {
            setErrors({
                _global: "Network error. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToBoard = async () => {
        if (isBusy) return;

        setNavigatingHome(true);

        try {
            await router.push("/");
        } finally {
            setNavigatingHome(false);
        }
    };

    const inputClass = isDark
        ? "w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-slate-500"
        : "w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition placeholder:text-slate-400";

    const labelClass = isDark
        ? "block text-sm font-semibold text-slate-200 mb-1.5"
        : "block text-sm font-semibold text-slate-700 mb-1.5";

    const errorClass = "mt-1 text-xs text-red-500";
    const pageBg = isDark
        ? "bg-slate-950"
        : "bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100";
    const panelBg = isDark
        ? "bg-slate-900 border-slate-800"
        : "bg-white border-slate-200";
    const textMuted = isDark ? "text-slate-400" : "text-slate-500";

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${pageBg}`}
        >
            <header
                className={`sticky top-0 z-20 border-b backdrop-blur-sm ${
                    isDark
                        ? "border-slate-800 bg-slate-900/80"
                        : "border-slate-200 bg-white/80"
                }`}
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={handleBackToBoard}
                        disabled={isBusy}
                        className={`inline-flex items-center gap-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                            isDark ? "text-slate-100" : "text-slate-700"
                        }`}
                    >
                        {navigatingHome && (
                            <FaSpinner className="animate-spin" />
                        )}
                        {navigatingHome ? "Returning..." : "← Back to Board"}
                    </button>

                    {toggleTheme && (
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={
                                isDark
                                    ? "Switch to light theme"
                                    : "Switch to dark theme"
                            }
                            title={
                                isDark
                                    ? "Switch to light theme"
                                    : "Switch to dark theme"
                            }
                            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                                isDark
                                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                            }`}
                        >
                            {isDark ? <FaSun /> : <FaMoon />}
                        </button>
                    )}
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div
                    className={`rounded-2xl border shadow-sm ${panelBg} p-6 sm:p-8`}
                >
                    <div className="mb-6">
                        <h1
                            className={`text-2xl font-bold ${
                                isDark ? "text-slate-50" : "text-slate-900"
                            }`}
                        >
                            {isEditing ? "Edit Notice" : "Create Notice"}
                        </h1>
                        <p className={`mt-1 text-sm ${textMuted}`}>
                            {isEditing
                                ? "Update the notice details below."
                                : "Add a new notice to the board."}
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="space-y-6"
                    >
                        {errors._global && (
                            <div
                                className={`rounded-xl border px-4 py-3 text-sm ${
                                    isDark
                                        ? "border-red-800 bg-red-950/50 text-red-300"
                                        : "border-red-200 bg-red-50 text-red-700"
                                }`}
                            >
                                {errors._global}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className={labelClass}>
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Mid-semester Exam Schedule"
                                className={`${inputClass} ${
                                    errors.title ? "border-red-400" : ""
                                }`}
                            />
                            {errors.title && (
                                <p className={errorClass}>{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="body" className={labelClass}>
                                Body <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="body"
                                name="body"
                                rows={5}
                                value={form.body}
                                onChange={handleChange}
                                placeholder="Describe the notice in detail..."
                                className={`${inputClass} resize-none ${
                                    errors.body ? "border-red-400" : ""
                                }`}
                            />
                            {errors.body && (
                                <p className={errorClass}>{errors.body}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="category"
                                    className={labelClass}
                                >
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="General">General</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Event">Event</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="priority"
                                    className={labelClass}
                                >
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="eventDate" className={labelClass}>
                                Event Date{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="eventDate"
                                name="eventDate"
                                type="date"
                                value={form.eventDate}
                                onChange={handleChange}
                                className={`${inputClass} ${
                                    errors.eventDate ? "border-red-400" : ""
                                }`}
                            />
                            {errors.eventDate && (
                                <p className={errorClass}>{errors.eventDate}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className={labelClass}>
                                Image URL{" "}
                                <span
                                    className={`font-normal ${
                                        isDark
                                            ? "text-slate-500"
                                            : "text-slate-400"
                                    }`}
                                >
                                    (optional)
                                </span>
                            </label>
                            <input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                value={form.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className={`${inputClass} ${
                                    errors.imageUrl ? "border-red-400" : ""
                                }`}
                            />
                            {errors.imageUrl && (
                                <p className={errorClass}>{errors.imageUrl}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <button
                                type="submit"
                                disabled={isBusy}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting && (
                                    <FaSpinner className="animate-spin" />
                                )}
                                {submitting
                                    ? "Saving..."
                                    : isEditing
                                      ? "Save Changes"
                                      : "Create Notice"}
                            </button>

                            <button
                                type="button"
                                onClick={handleBackToBoard}
                                disabled={isBusy}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                                        : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {navigatingHome && (
                                    <FaSpinner className="animate-spin" />
                                )}
                                {navigatingHome ? "Returning..." : "Cancel"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
