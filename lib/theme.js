export const THEME_COOKIE = "notice-theme";
export const THEMES = ["light", "dark"];
const THEME_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const normalizeTheme = (theme, fallback = "light") =>
    THEMES.includes(theme) ? theme : fallback;

function getCookieTheme(cookieHeader = "") {
    const cookie = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${THEME_COOKIE}=`));

    if (!cookie) return null;

    try {
        return normalizeTheme(decodeURIComponent(cookie.split("=")[1]), null);
    } catch {
        return null;
    }
}

export const getThemeFromRequest = (req) =>
    getCookieTheme(req?.headers?.cookie || "") || "light";

export const getInitialTheme = (fallback = "light") => {
    const safeFallback = normalizeTheme(fallback);

    if (typeof window === "undefined") return safeFallback;

    try {
        const saved = localStorage.getItem(THEME_COOKIE);
        if (saved === "dark" || saved === "light") return saved;
    } catch {
        return safeFallback;
    }

    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }

    return safeFallback;
};

export const applyTheme = (theme) => {
    if (typeof document === "undefined") return;

    const nextTheme = normalizeTheme(theme);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    document.cookie = `${THEME_COOKIE}=${encodeURIComponent(
        nextTheme,
    )}; Path=/; Max-Age=${THEME_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;

    try {
        localStorage.setItem(THEME_COOKIE, nextTheme);
    } catch {
        // The cookie still carries the preference if localStorage is unavailable.
    }
};
