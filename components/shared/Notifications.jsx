import Link from "next/link"
import moment from "moment"
import { useEffect, useState } from "react"
import NotificationService from "@/services/NotificationService"
import ErrorBoundary from "@/layout/ErrorBoundary"
import { useRouter } from "next/router"

const Notifications = () => {
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

    const getData = () => {
        NotificationService.getNotifications()
            .then((resp) => {
                setNotifications(resp.data.data.items)
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false))
    }

    const handleClick = async (id, link) => {
        NotificationService.readNotification(id)
            .then((resp) => {
                const newNotifs = notifications.map(notif => {
                    return {
                        ...notif,
                        read: notif.id === id ? true : notif.read
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
                router.push(link)
            })
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!notifications || notifications.length === 0) {
        return (
            <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-sm mt-6 text-gray-500 text-sm">
                Bildirimin yok.
            </div>
        )
    }

    return (
        <ErrorBoundary error={error} loading={loading}>
            <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-sm mt-6">
                <h3 className="text-md font-bold text-sky-700 mb-2">🔔 Bildirimler</h3>
                <ul className="space-y-3 text-sm">
                    {notifications.map((notif, index) => (
                        <li key={index} className={`border-b pb-2 ${!notif.read ? "font-semibold" : "text-gray-600"}`}>
                            <span onClick={() => handleClick(notif.id, notif.link)} href={notif.link} className="hover:underline cursor-pointer">
                                {notif.message}
                            </span>
                            <p className="text-xs text-gray-400">{moment(notif.createdAt).fromNow()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </ErrorBoundary>
    )
}

export default Notifications
