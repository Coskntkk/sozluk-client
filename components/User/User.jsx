import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import UserService from "@/services/UserService"
import ErrorBoundary from "@/layout/ErrorBoundary"
import Pagination from "../shared/Pagination";
import Image from "next/image";
import moment from "moment"
import EntryWithTitle from "../shared/EntryWithTitle";

const User = ({ username }) => {
    const currentUser = useSelector((state) => state.auth.user);

    const [usernamex, setUsernamex] = useState("");
    const [user, setUser] = useState({});
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

    const getData = () => {
        UserService.getUser(username)
            .then((resp) => {
                const userData = resp.data.data;
                setUser(userData);
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

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await UserService.unfollowUser(username);
                setIsFollowing(false);
                setFollowerCount(followerCount - 1);
            } else {
                await UserService.followUser(username);
                setIsFollowing(true);
                setFollowerCount(followerCount + 1);
            }
        } catch (err) {
            console.log("Follow toggle failed:", err);
        }
    }

    useEffect(() => {
        setUsernamex(username)
    }, [username]);

    useEffect(() => {
        if (usernamex) {
            getData();
            getEntries(usernamex, 10, 1)
        }
    }, [usernamex]);

    const isCurrentUser = currentUser?.username === usernamex;

    return (
        <ErrorBoundary error={error} loading={loading}>
            <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                    {user?.image_url && <Image
                        src={user?.image_url}
                        alt={user?.username}
                        width={100}
                        height={100}
                        className="w-20 h-20 rounded-full border shadow"
                    />}
                    <div>
                        <h2 className="text-2xl font-bold text-sky-800">👤 {user?.username}</h2>
                        <p className="text-gray-500 text-sm">Katıldı: {moment(user?.createdAt).format('DD.MM.YYYY hh:mm')}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">Takipçi: {followerCount}</span>
                            <span className="text-sm text-gray-600">Takip Edilen: {followingCount}</span>
                            {!isCurrentUser && (
                                <button
                                    onClick={handleFollowToggle}
                                    className={`text-sm px-3 py-1 rounded ${
                                        isFollowing ? "bg-gray-300 text-black" : "bg-sky-600 text-white"
                                    }`}
                                >
                                    {isFollowing ? "Takibi Bırak" : "Takip Et"}
                                </button>
                            )}
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
