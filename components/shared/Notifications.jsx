import Link from "next/link"
import moment from "moment"
import "moment/locale/tr"
import "moment/locale/fr"
import { useEffect, useState } from "react"
import NotificationService from "@/services/NotificationService"
import ErrorBoundary from "@/layout/ErrorBoundary"
import { useRouter } from "next/router"
import Pagination from "./Pagination"
import { useTranslation } from "react-i18next"

const Notifications = () => {
    const { t, i18n } = useTranslation('notifications');
    moment.locale(i18n.language)
    const router = useRouter()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        limit: 10
    });
    const [error, setError] = useState({
        isError: false,
        message: ''
    });

    const getData = (limit, page) => {
        NotificationService.getNotifications(
            {
                page: page,
                limit: limit
            }
        )
            .then((resp) => {
                const data = resp.data.data
                setNotifications(data.items)
                setPagination({
                    page: data.page,
                    totalPages: data.total_pages,
                    limit: data.limit
                })
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false))
    }

    const onPaginationChange = (newPage) => {
        setPagination({
            ...pagination,
            page: newPage
        })
        getData(pagination.limit, newPage)
    }

    const handleClick = async (notif, link) => {
        if (!notif.read)
            NotificationService.readNotification(notif.id)
                .then((resp) => {
                    const newNotifs = notifications.map(n => {
                        return {
                            ...n,
                            read: notif.id === n.id ? true : n.read
                        }
                    })
                    setNotifications(newNotifs)
                })
                .catch((err) => {
                    setError({
                        isError: true,
                        message: err.response?.data?.message || "Something went wrong."
                    });
                })
                .finally(() => {
                    setLoading(false)
                })
        router.push(link)
    }

    useEffect(() => {
        getData(pagination.limit, pagination.page)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!notifications || notifications.length === 0) {
        return (
            <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-sm mt-6 text-gray-500 text-sm">
                {t("no_notifications")}
            </div>
        )
    }

    return (
        <ErrorBoundary error={error} loading={loading}>
            <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-sm mt-6">
                <h3 className="text-md font-bold text-sky-700 mb-2">
                    🔔 {t("notifications")}
                </h3>
                <ul className="space-y-3 text-sm">
                    {notifications.map((notif, index) => (
                        <li key={index} className={`border-b pb-2 ${!notif.read ? "font-semibold" : "text-gray-600"}`}>
                            <span onClick={() => handleClick(notif, notif.link)} href={notif.link} className="hover:underline cursor-pointer">
                                {t(notif.message)}
                            </span>
                            <p className="text-xs text-gray-400">
                                {moment(notif.createdAt).fromNow().toLocaleString("fr")}
                            </p>
                        </li>
                    ))}
                </ul>
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPaginationChange}
                    size={"small"}
                />
            </div>
        </ErrorBoundary>
    )
}

export default Notifications
