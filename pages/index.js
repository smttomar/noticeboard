import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
    FaMoon,
    FaSun,
    FaPlus,
    FaSearch,
    FaInbox,
    FaClipboardList,
    FaExclamationTriangle,
} from "react-icons/fa";
import NoticeCard from "../components/NoticeCard";
import { getRoleFromRequest, isAdminRole } from "../lib/auth";
import { getThemeFromRequest } from "../lib/theme";
import { useNoticeTheme } from "../lib/useNoticeTheme";

export async function getServerSideProps({ req }) {
    const { default: prisma } = await import("../lib/prisma");

    const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { eventDate: "desc" }],
    });

    const role = getRoleFromRequest(req);
    const isAdmin = isAdminRole(role);
    const initialTheme = getThemeFromRequest(req);

    return {
        props: {
            initialNotices: JSON.parse(JSON.stringify(notices)),
            isAdmin,
            initialTheme,
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Home({
    initialNotices,
    isAdmin: initialIsAdmin,
    initialTheme,
}) {
    const router = useRouter();

    const [notices, setNotices] = useState(initialNotices);
    const [search, setSearch] = useState("");
    const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
    const { theme, toggleTheme } = useNoticeTheme(initialTheme);

    useEffect(() => {
        setIsAdmin(initialIsAdmin);
    }, [initialIsAdmin]);

    const handleDelete = (id) => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setIsAdmin(false);
        router.push("/");
    };

    const urgentCount = useMemo(
        () => notices.filter((n) => n.priority === "Urgent").length,
        [notices],
    );

    const filteredNotices = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return notices;

        return notices.filter((notice) => {
            const title = notice.title?.toLowerCase() || "";
            const content =
                notice.content?.toLowerCase() ||
                notice.body?.toLowerCase() ||
                "";

            return title.includes(term) || content.includes(term);
        });
    }, [notices, search]);

    const isDark = theme === "dark";
    const hasNotices = notices.length > 0;
    const hasSearchResults = filteredNotices.length > 0;

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                isDark
                    ? "bg-slate-950 text-slate-100"
                    : "bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 text-slate-900"
            }`}
        >
            <header
                className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
                    isDark
                        ? "border-slate-800 bg-slate-900/80"
                        : "border-slate-200 bg-white/80"
                }`}
            >
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                            <FaClipboardList />
                            <span>Notice Board</span>
                        </h1>
                        <p
                            className={`mt-0.5 text-xs ${
                                isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                        >
                            {notices.length} notice
                            {notices.length !== 1 ? "s" : ""}
                            {urgentCount > 0 && (
                                <span
                                    className={`ml-2 font-semibold ${
                                        isDark ? "text-red-400" : "text-red-600"
                                    }`}
                                >
                                    · {urgentCount} urgent
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-1 items-center gap-3 md:max-w-md">
                        <label htmlFor="search" className="sr-only">
                            Search notices
                        </label>
                        <div className="relative w-full">
                            <FaSearch
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                }`}
                            />
                            <input
                                id="search"
                                type="text"
                                placeholder="Search notices..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                                    isDark
                                        ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-900/50"
                                        : "border-slate-300 bg-white text-slate-800 focus:border-indigo-500 focus:ring-indigo-200"
                                }`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
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
                            className={`inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                isDark
                                    ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                            }`}
                        >
                            {isDark ? <FaSun /> : <FaMoon />}
                        </button>

                        {isAdmin ? (
                            <>
                                <Link
                                    href="/notices/new"
                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                                >
                                    <FaPlus />
                                    New Notice
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                                        isDark
                                            ? "bg-slate-800 text-slate-100 hover:bg-slate-700"
                                            : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                                    }`}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
                            >
                                Admin Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {!hasNotices ? (
                    <div className="py-24 text-center">
                        <div className="mb-4 text-6xl text-slate-400">
                            <FaInbox />
                        </div>
                        <h2
                            className={`mb-2 text-2xl font-bold ${
                                isDark ? "text-slate-100" : "text-slate-700"
                            }`}
                        >
                            No notices yet
                        </h2>
                        <p
                            className={
                                isDark ? "text-slate-400" : "text-slate-500"
                            }
                        >
                            Get started by creating your first notice.
                        </p>
                        {isAdmin && (
                            <Link
                                href="/notices/new"
                                className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700"
                            >
                                Create Notice
                            </Link>
                        )}
                    </div>
                ) : !hasSearchResults ? (
                    <div className="py-16 text-center">
                        <div className="mb-3 text-5xl text-slate-400">
                            <FaSearch />
                        </div>
                        <h2
                            className={`mb-2 text-xl font-semibold ${
                                isDark ? "text-slate-100" : "text-slate-700"
                            }`}
                        >
                            No notices match your search
                        </h2>
                        <p
                            className={
                                isDark ? "text-slate-400" : "text-slate-500"
                            }
                        >
                            Try a different keyword or clear the search.
                        </p>
                    </div>
                ) : (
                    <>
                        {urgentCount > 0 && (
                            <div
                                className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
                                    isDark
                                        ? "border-red-800 bg-red-950/50 text-red-300"
                                        : "border-red-200 bg-red-50 text-red-700"
                                }`}
                            >
                                <FaExclamationTriangle />
                                <strong>
                                    {urgentCount} urgent notice
                                    {urgentCount > 1 ? "s" : ""}
                                </strong>{" "}
                                pinned to the top.
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredNotices.map((notice) => (
                                <NoticeCard
                                    key={notice.id}
                                    notice={notice}
                                    onDelete={handleDelete}
                                    theme={theme}
                                    canManage={isAdmin}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
