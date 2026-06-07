import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNoticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">New Notice</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <NoticeForm />
        </div>
      </main>
    </div>
  );
}
