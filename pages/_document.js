import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html suppressHydrationWarning>
                <Head />
                <body>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                (function () {
                  try {
                    const cookieTheme = document.cookie
                      .split(";")
                      .map(function (part) { return part.trim(); })
                      .find(function (part) { return part.indexOf("notice-theme=") === 0; });
                    const saved = localStorage.getItem("notice-theme") ||
                      (cookieTheme ? decodeURIComponent(cookieTheme.split("=")[1]) : null);
                    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    const dark = saved ? saved === "dark" : prefersDark;

                    document.documentElement.dataset.theme = dark ? "dark" : "light";
                    document.documentElement.classList.toggle("dark", dark);
                    document.documentElement.style.colorScheme = dark ? "dark" : "light";
                  } catch (e) {}
                })();
              `,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
