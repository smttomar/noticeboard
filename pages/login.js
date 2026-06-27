import { useState } from "react";
import { useRouter } from "next/router";
import { FaSpinner } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            await router.push("/");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">
                <img
                    src="/logo.svg"
                    alt=""
                    aria-hidden="true"
                    className="mb-4 h-12 w-12 rounded-xl"
                />
                <h1 className="text-2xl font-bold text-white mb-6">
                    Admin Login
                </h1>

                <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-amber-300">
                                Administrator Access
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-slate-300">
                                This portal is restricted to authorized
                                administrators only. Login credentials are
                                provided by the system administrator. If you do
                                not have valid credentials, please contact your
                                administrator for access.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    />

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && <FaSpinner className="animate-spin" />}
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
