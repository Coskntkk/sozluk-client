import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import UserService from "@/services/UserService"
import ErrorBoundary from "@/layout/ErrorBoundary"
import Pagination from "../shared/Pagination";
import Image from "next/image";
import moment from "moment"
import EntryWithTitle from "../shared/EntryWithTitle";
import Follow from "../shared/Follow";
import { useTranslation } from "react-i18next";

const User = ({ username }) => {
    const { t } = useTranslation('user');
    const { user } = useSelector((state) => state.auth);
    const [usernamex, setUsernamex] = useState("");
    const [userx, setUserx] = useState({});
    const [entries, setEntries] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
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

    const getUser = () => {
        UserService.getUser(username)
            .then((resp) => {
                const userData = resp.data.data;
                setUserx(userData);
                setIsFollowing(userData.isFollowing);
                setFollowerCount(userData.followerCount);
                setFollowingCount(userData.followingCount);
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false));
    }

    const getEntries = (username, limit, page) => {
        UserService.getUserEntries(username, { page, limit })
            .then((resp) => {
                const data = resp.data.data;
                setEntries(data.items);
                setPagination({
                    page: data.page,
                    totalPages: Math.floor(data.total / data.limit) + 1,
                    limit: data.limit
                });
            })
            .catch((err) => {
                setError({
                    isError: true,
                    message: err.response?.data?.message || "Something went wrong."
                });
            })
            .finally(() => setLoading(false));
    }

    const onPaginationChange = async (newPage) => {
        setPagination({ ...pagination, page: newPage });
        getEntries(username, pagination.limit, newPage);
    }

    const getData = async () => {
        getUser();
        getEntries(usernamex, 10, 1)
    }

    useEffect(() => {
        setUsernamex(username)
    }, [username]);

    useEffect(() => {
        if (usernamex) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usernamex]);

    return (
        <ErrorBoundary error={error} loading={loading}>
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                    {userx?.image_url && <Image
                        src={userx?.image_url}
                        alt={userx?.username}
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-full border shadow"
                    />}
                    <div>
                        <h2 className="text-2xl font-bold text-sky-800">👤 {userx?.username}</h2>
                        <p className="text-gray-500 text-sm">
                            {t("joined")}: {moment(userx?.createdAt).format('DD.MM.YYYY hh:mm')}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                                {t("follower")}: {followerCount}
                            </span>
                            <span className="text-sm text-gray-600">
                                {t("following")}: {followingCount}
                            </span>
                            <Follow
                                username={userx.username}
                                isFollowing={userx.isFollowing === "1"}
                                isOwn={userx.id === user.id}
                                onUse={getData}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {entries.map(entry => (
                        <EntryWithTitle entry={entry} key={entry.id} />
                    ))}
                </div>
            </div>
            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={onPaginationChange}
            />
        </ErrorBoundary>
    )
};

export default User;
