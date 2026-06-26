import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
    FaEdit,
    FaTrash,
    FaTimes,
    FaExclamationTriangle,
} from "react-icons/fa";

const CATEGORY_COLORS = {
    Exam: {
        bg: "bg-blue-50 border-blue-200",
        badge: "bg-blue-100 text-blue-700",
    },
    Event: {
        bg: "bg-emerald-50 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700",
    },
    General: {
        bg: "bg-slate-50 border-slate-200",
        badge: "bg-slate-100 text-slate-600",
    },
};

export default function NoticeCard({
    notice,
    onDelete,
    theme = "light",
    canManage = false,
}) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const closeTimeout = useRef(null);

    const isDark = theme === "dark";
    const colors = CATEGORY_COLORS[notice.category] || CATEGORY_COLORS.General;
    const isUrgent = notice.priority === "Urgent";
    const content = notice.content || notice.body || "";
    const imageAlt = notice.title || "Notice image";

    useEffect(() => {
        if (isOpen && !isClosing) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, isClosing]);

    useEffect(() => {
        return () => {
            if (closeTimeout.current) clearTimeout(closeTimeout.current);
        };
    }, []);

    const handleDelete = async () => {
        setDeleting(true);

        try {
            const res = await fetch(`/api/notices/${notice.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete notice.");
            }

            setShowConfirm(false);
            onDelete(notice.id);
        } catch (error) {
            console.error(error);
            alert("Unable to delete this notice. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    const eventDate = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(notice.eventDate));

    const openModal = () => {
        if (showConfirm) return;
        setIsClosing(false);
        setIsVisible(false);
        setIsOpen(true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        });
    };

    const closeModal = () => {
        if (!isOpen) return;
        setIsClosing(true);
        setIsVisible(false);

        if (closeTimeout.current) clearTimeout(closeTimeout.current);

        closeTimeout.current = setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setIsVisible(false);
        }, 300);
    };

    const cardSurface = isDark
        ? "bg-slate-900 border-slate-700"
        : `${colors.bg} border-slate-200`;

    const cardTitle = isDark ? "text-slate-100" : "text-slate-800";
    const cardBody = isDark ? "text-slate-300" : "text-slate-600";
    const cardMeta = isDark ? "text-slate-400" : "text-slate-400";
    const cardBorder = isDark ? "border-slate-800" : "border-slate-200";
    const actionButton = isDark
        ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
        : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50";
    const actionDanger = isDark
        ? "bg-red-600 hover:bg-red-700"
        : "bg-red-500 hover:bg-red-600";
    const confirmBox = isDark
        ? "border-red-900 bg-red-950/50"
        : "border-red-200 bg-red-50";
    const modalSurface = isDark
        ? "bg-slate-900 text-slate-100"
        : "bg-white text-slate-900";

    const publishedDate = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(notice.createdAt));

    return (
        <>
            <article
                role="button"
                tabIndex={0}
                onClick={openModal}
                onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !showConfirm) {
                        e.preventDefault();
                        openModal();
                    }
                }}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 ${cardSurface} ${
                    isUrgent
                        ? isDark
                            ? "border-red-700 shadow-red-900/20"
                            : "border-red-300 shadow-red-100"
                        : ""
                } shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
            >
                {isUrgent && (
                    <div className="absolute top-4 left-4 z-20">
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/75 backdrop-blur-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white shadow-xl">
                            <FaExclamationTriangle />
                            Urgent
                        </span>
                    </div>
                )}

                {notice.imageUrl && (
                    <div className="relative h-40 w-full overflow-hidden">
                        <img
                            src={notice.imageUrl}
                            alt={imageAlt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                    </div>
                )}

                <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isDark
                                    ? "bg-slate-800 text-slate-100"
                                    : colors.badge
                            }`}
                        >
                            {notice.category}
                        </span>
                        <span className={`text-xs ${cardMeta}`}>
                            Event Date: {eventDate}
                        </span>
                    </div>

                    <h2
                        className={`mb-2 text-lg font-bold leading-snug ${cardTitle}`}
                    >
                        {notice.title}
                    </h2>

                    <p
                        className={`line-clamp-1 text-sm leading-relaxed ${cardBody}`}
                    >
                        {content}
                    </p>

                    {canManage && (
                        <div
                            className={`mt-4 flex items-center justify-end gap-2 border-t pt-4 ${cardBorder}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {!showConfirm ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(
                                                `/notices/${notice.id}/edit`,
                                            );
                                        }}
                                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${actionButton}`}
                                    >
                                        <FaEdit className="inline mr-1" />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowConfirm(true);
                                        }}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white ${actionDanger}`}
                                    >
                                        <FaTrash className="inline mr-1" />
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <div
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${confirmBox}`}
                                >
                                    <span
                                        className={`text-xs font-medium ${
                                            isDark
                                                ? "text-red-300"
                                                : "text-red-700"
                                        }`}
                                    >
                                        Delete this notice?
                                    </span>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        disabled={deleting}
                                        className={`rounded-md px-2.5 py-1 text-xs font-bold text-white ${actionDanger} disabled:opacity-50`}
                                    >
                                        {deleting ? "..." : "Yes"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowConfirm(false);
                                        }}
                                        disabled={deleting}
                                        className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                                            isDark
                                                ? "border-slate-700 bg-slate-800 text-slate-100"
                                                : "border-slate-300 bg-white text-slate-600"
                                        } disabled:opacity-50`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </article>

            {isOpen && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm transition-opacity duration-300 ${
                        isClosing || !isVisible ? "opacity-0" : "opacity-100"
                    }`}
                    onClick={closeModal}
                >
                    <div
                        className={`relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl shadow-2xl transition-all duration-300 ${modalSurface} ${
                            isClosing || !isVisible
                                ? "translate-y-6 scale-95 opacity-0"
                                : "translate-y-0 scale-100 opacity-100"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={closeModal}
                            className={`absolute right-3 top-3 z-10 rounded-full p-2 shadow-sm ${
                                isDark
                                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                    : "bg-white/90 text-slate-700 hover:bg-white"
                            }`}
                        >
                            <FaTimes />
                        </button>

                        {notice.imageUrl && (
                            <img
                                src={notice.imageUrl}
                                alt={imageAlt}
                                className="h-64 w-full object-cover sm:h-80"
                            />
                        )}

                        <div className="p-6 sm:p-8">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        isDark
                                            ? "bg-slate-800 text-slate-100"
                                            : colors.badge
                                    }`}
                                >
                                    {notice.category}
                                </span>
                                <span
                                    className={`text-sm ${
                                        isDark
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    Event Date: {eventDate}
                                </span>
                                {isUrgent && (
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            isDark
                                                ? "bg-red-950 text-red-300"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        Urgent
                                    </span>
                                )}
                            </div>

                            <h2
                                className={`mb-3 text-2xl font-bold ${
                                    isDark ? "text-slate-50" : "text-slate-900"
                                }`}
                            >
                                {notice.title}
                            </h2>

                            <p
                                className={`whitespace-pre-wrap text-base leading-7 ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                }`}
                            >
                                {content}
                            </p>
                            <p
                                className={`mt-6 text-sm ${
                                    isDark ? "text-slate-400" : "text-slate-500"
                                }`}
                            >
                                Published on: {publishedDate}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
