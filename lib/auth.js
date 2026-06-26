import crypto from "crypto";

export const ROLE_COOKIE = "notice-role";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_MAX_AGE_MS = COOKIE_MAX_AGE_SECONDS * 1000;

function getSessionSecret() {
    return (
        process.env.ADMIN_SESSION_SECRET ||
        process.env.ADMIN_LOGIN_PASSWORD ||
        (process.env.NODE_ENV === "production"
            ? ""
            : "noticeboard-development-session-secret")
    );
}

function signValue(value) {
    const secret = getSessionSecret();
    if (!secret) return "";

    return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function signaturesMatch(left, right) {
    if (!left || !right) return false;

    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) return false;

    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createSignedRoleValue(role) {
    const value = `${role}.${Date.now()}`;
    const signature = signValue(value);

    return `${value}.${signature}`;
}

function parseSignedRoleValue(cookieValue) {
    if (!cookieValue) return null;

    const [role, timestamp, signature, ...extra] = cookieValue.split(".");

    if (extra.length > 0 || !["admin", "user"].includes(role)) {
        return null;
    }

    const issuedAt = Number(timestamp);
    if (!Number.isFinite(issuedAt)) return null;

    if (Date.now() - issuedAt > COOKIE_MAX_AGE_MS) {
        return null;
    }

    const expectedSignature = signValue(`${role}.${timestamp}`);
    if (!signaturesMatch(signature, expectedSignature)) {
        return null;
    }

    return role;
}

export function parseCookies(cookieHeader = "") {
    const cookies = {};

    cookieHeader.split(";").forEach((cookie) => {
        const [key, ...rest] = cookie.split("=");
        if (!key) return;

        const trimmedKey = key.trim();
        const trimmedValue = rest.join("=").trim();

        if (trimmedKey && trimmedValue !== undefined) {
            try {
                cookies[trimmedKey] = decodeURIComponent(trimmedValue);
            } catch {
                cookies[trimmedKey] = trimmedValue;
            }
        }
    });

    return cookies;
}

export function getRoleFromRequest(req) {
    const cookies = parseCookies(req.headers.cookie || "");
    const role = parseSignedRoleValue(cookies[ROLE_COOKIE]);

    return role || "user";
}

export function isAdminRole(role) {
    return role === "admin";
}

export function setRoleCookie(res, role) {
    const value = role === "admin" ? "admin" : "user";
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    res.setHeader(
        "Set-Cookie",
        `${ROLE_COOKIE}=${encodeURIComponent(
            createSignedRoleValue(value),
        )}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
    );
}

export function clearRoleCookie(res) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    res.setHeader(
        "Set-Cookie",
        `${ROLE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`,
    );
}
