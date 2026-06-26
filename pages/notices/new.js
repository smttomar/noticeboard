import NoticeForm from "../../components/NoticeForm";
import { getRoleFromRequest, isAdminRole } from "../../lib/auth";
import { getThemeFromRequest } from "../../lib/theme";
import { useNoticeTheme } from "../../lib/useNoticeTheme";

export async function getServerSideProps({ req }) {
    const role = getRoleFromRequest(req);

    if (!isAdminRole(role)) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            initialTheme: getThemeFromRequest(req),
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function NewNoticePage({ initialTheme }) {
    const { theme, toggleTheme } = useNoticeTheme(initialTheme);

    return <NoticeForm theme={theme} toggleTheme={toggleTheme} />;
}
