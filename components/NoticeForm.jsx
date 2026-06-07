import { useState } from "react";
import { useRouter } from "next/router";

export default function NoticeForm({ initialData, noticeId }) {
  const router = useRouter();
  const isEditing = !!noticeId;

  const toDateInputValue = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    title: initialData?.title || "",
    body: initialData?.body || "",
    category: initialData?.category || "General",
    priority: initialData?.priority || "Normal",
    publishDate: toDateInputValue(initialData?.publishDate) || "",
    imageUrl: initialData?.imageUrl || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const url = isEditing ? `/api/notices/${noticeId}` : "/api/notices";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 422) {
        setErrors(data.errors || {});
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setErrors({ _global: data.error || "Something went wrong." });
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch {
      setErrors({ _global: "Network error. Please try again." });
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errors._global && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {errors._global}
        </div>
      )}

      {/* Title */}
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
          className={`${inputClass} ${errors.title ? "border-red-400" : ""}`}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      {/* Body */}
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
          className={`${inputClass} resize-none ${errors.body ? "border-red-400" : ""}`}
        />
        {errors.body && <p className={errorClass}>{errors.body}</p>}
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>
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
          {errors.category && <p className={errorClass}>{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="priority" className={labelClass}>
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
          {errors.priority && <p className={errorClass}>{errors.priority}</p>}
        </div>
      </div>

      {/* Publish Date */}
      <div>
        <label htmlFor="publishDate" className={labelClass}>
          Publish Date <span className="text-red-500">*</span>
        </label>
        <input
          id="publishDate"
          name="publishDate"
          type="date"
          value={form.publishDate}
          onChange={handleChange}
          className={`${inputClass} ${errors.publishDate ? "border-red-400" : ""}`}
        />
        {errors.publishDate && <p className={errorClass}>{errors.publishDate}</p>}
      </div>

      {/* Image URL (bonus) */}
      <div>
        <label htmlFor="imageUrl" className={labelClass}>
          Image URL <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={inputClass}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 sm:flex-none px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
        >
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={submitting}
          className="px-6 py-2.5 text-slate-600 font-medium border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
