import { useCallback, useEffect, useState } from "react";
import { applyTheme, getInitialTheme, normalizeTheme } from "./theme";

export function useNoticeTheme(initialTheme = "light") {
    const [theme, setTheme] = useState(() => normalizeTheme(initialTheme));

    useEffect(() => {
        const nextTheme = getInitialTheme(initialTheme);
        setTheme(nextTheme);
        applyTheme(nextTheme);
    }, [initialTheme]);

    const toggleTheme = useCallback(() => {
        setTheme((currentTheme) => {
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
            return nextTheme;
        });
    }, []);

    return { theme, toggleTheme };
}
