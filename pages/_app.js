import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Notice Board</title>
                <meta
                    name="description"
                    content="Create, manage, and browse important notices from a simple shared board."
                />
                <meta name="application-name" content="Notice Board" />
                <meta name="author" content="Notice Board" />
                <meta name="keywords" content="notice board, notices, announcements, admin notices" />
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#4F46E5" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Notice Board" />
                <meta property="og:title" content="Notice Board" />
                <meta
                    property="og:description"
                    content="Create, manage, and browse important notices from a simple shared board."
                />
                <meta property="og:image" content="/logo.svg" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Notice Board" />
                <meta
                    name="twitter:description"
                    content="Create, manage, and browse important notices from a simple shared board."
                />
                <meta name="twitter:image" content="/logo.svg" />
                <link rel="icon" type="image/svg+xml" href="/logo.svg" />
                <link rel="shortcut icon" href="/logo.svg" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
