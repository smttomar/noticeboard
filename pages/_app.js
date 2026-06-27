import Head from "next/head";
import "../styles/globals.css";

const defaultSiteUrl = "https://noticeboard-puce.vercel.app";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(
    /\/$/,
    ""
);
const appTitle = "Notice Board";
const appDescription =
    "Create, manage, search, and browse important notices from a simple shared board.";
const ogImagePath = "/og-image.png";
const ogImageUrl = `${siteUrl}${ogImagePath}`;

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>{appTitle}</title>
                <meta name="description" content={appDescription} />
                <meta name="application-name" content={appTitle} />
                <meta name="author" content={appTitle} />
                <meta
                    name="keywords"
                    content="notice board, notices, announcements, admin notices"
                />
                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#4F46E5" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content={appTitle} />
                <meta property="og:title" content={appTitle} />
                <meta property="og:description" content={appDescription} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:image" content={ogImageUrl} />
                <meta property="og:image:secure_url" content={ogImageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:alt" content="Notice Board app preview" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={appTitle} />
                <meta name="twitter:description" content={appDescription} />
                <meta name="twitter:image" content={ogImageUrl} />
                <meta name="twitter:image:alt" content="Notice Board app preview" />
                <link rel="canonical" href={siteUrl} />
                <link rel="icon" type="image/svg+xml" href="/logo.svg" />
                <link rel="shortcut icon" href="/logo.svg" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
