import NoticeForm from "../../../components/NoticeForm";
import { getRoleFromRequest, isAdminRole } from "../../../lib/auth";
import { getThemeFromRequest } from "../../../lib/theme";
import { useNoticeTheme } from "../../../lib/useNoticeTheme";

export async function getServerSideProps({ req, params }) {
    const role = getRoleFromRequest(req);

    if (!isAdminRole(role)) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    const { default: prisma } = await import("../../../lib/prisma");
    const noticeId = Number(params.id);

    if (!Number.isInteger(noticeId)) {
        return { notFound: true };
    }

    const notice = await prisma.notice.findUnique({
        where: { id: noticeId },
    });

    if (!notice) {
        return { notFound: true };
    }

    return {
        props: {
            initialData: JSON.parse(JSON.stringify(notice)),
            noticeId: params.id,
            initialTheme: getThemeFromRequest(req),
        },
    };
}

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function EditNoticePage({ initialData, noticeId, initialTheme }) {
    const { theme, toggleTheme } = useNoticeTheme(initialTheme);

    return (
        <NoticeForm
            initialData={initialData}
            noticeId={noticeId}
            theme={theme}
            toggleTheme={toggleTheme}
        />
    );
}
