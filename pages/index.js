import { useState } from "react";
import Link from "next/link";
import NoticeCard from "../components/NoticeCard";

export async function getServerSideProps() {
  // Import prisma directly on the server
  const { default: prisma } = await import("../lib/prisma");
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });
  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);

  const handleDelete = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const urgentCount = notices.filter((n) => n.priority === "Urgent").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              📋 Notice Board
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
              {notices.length} notice{notices.length !== 1 ? "s" : ""}
              {urgentCount > 0 && (
                <span className="ml-2 text-red-600 font-semibold">
                  · {urgentCount} urgent
                </span>
              )}
            </p>
          </div>
          <Link
            href="/notices/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="text-lg leading-none">+</span> New Notice
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {notices.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No notices yet</h2>
            <p className="text-slate-500 mb-6">Get started by creating your first notice.</p>
            <Link
              href="/notices/new"
              className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Create Notice
            </Link>
          </div>
        ) : (
          <>
            {/* Filter strip - informational */}
            {urgentCount > 0 && (
              <div className="mb-6 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                <span>⚠️</span>
                <strong>{urgentCount} urgent notice{urgentCount > 1 ? "s" : ""}</strong>
                {" "}pinned to the top.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
