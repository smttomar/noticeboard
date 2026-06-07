import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORY_COLORS = {
  Exam: { bg: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700" },
  Event: { bg: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  General: { bg: "bg-slate-50 border-slate-200", badge: "bg-slate-100 text-slate-600" },
};

export default function NoticeCard({ notice, onDelete }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const colors = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS.General;
  const isUrgent = notice.priority === "Urgent";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete(notice.id);
      } else {
        alert("Failed to delete notice.");
        setDeleting(false);
        setShowConfirm(false);
      }
    } catch {
      alert("Network error.");
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const publishDate = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`relative rounded-2xl border-2 ${colors.bg} ${
        isUrgent ? "border-red-300 shadow-red-100" : ""
      } shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
    >
      {/* Urgent banner */}
      {isUrgent && (
        <div className="bg-red-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-1 flex items-center gap-1">
          <span>⚠</span> Urgent Notice
        </div>
      )}

      {/* Image */}
      {notice.imageUrl && (
        <img
          src={notice.imageUrl}
          alt={notice.title}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge}`}>
            {notice.category}
          </span>
          <span className="text-xs text-slate-400">{publishDate}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{notice.title}</h2>

        {/* Body */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{notice.body}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-200">
          {!showConfirm ? (
            <>
              <button
                onClick={() => router.push(`/notices/${notice.id}/edit`)}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑 Delete
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <span className="text-xs text-red-700 font-medium">Delete this notice?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-2.5 py-1 text-xs font-bold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
