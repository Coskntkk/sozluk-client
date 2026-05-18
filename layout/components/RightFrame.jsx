import moment from "moment"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import HomeService from "@/services/HomeService";
import Notifications from "@/components/shared/Notifications";
import ErrorBoundary from "@/layout/ErrorBoundary"
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

const ProfileSidebar = () => {
  const { t } = useTranslation('rightframe')
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({
    isError: false,
    message: ''
  })

  const getData = () => {
    setLoading(true)
    HomeService.getRightframe()
      .then((resp) => {
        setData(resp.data.data)
      })
      .catch((err) => {
        setError({
          isError: true,
          message: err.response?.data?.message || "Something went wrong."
        });
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    isAuthenticated && getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return (
    <ErrorBoundary error={error} loading={loading}>
      {isAuthenticated
        ? <div className="bg-white p-4 shadow-md rounded-lg w-full max-w-sm sticky top-4">
          <div className="flex items-center space-x-4 mb-4">
            <Image
              src={user.image_url || "https://www.shareicon.net/data/512x512/2017/01/06/868320_people_512x512.png"}
              alt={user.username}
              width={60}
              height={60}
              className="rounded-full border"
            />
            <div>
              <Link href={`/u/${user.username}`} className="text-lg font-bold text-sky-700">{user.username}</Link>
              <p className="text-sm text-gray-500">
                {t("joined")}: {moment(user.createdAt).format("DD.MM.YYYY")}
              </p>
            </div>
          </div>

          {data && <div className="text-sm text-gray-700 space-y-1 mb-4">
            <p>✍️ {t("entry_count")}: <strong>{data.entryCount}</strong></p>
            <p>👥 {t("follower")}: <strong>{data.followerCount}</strong></p>
            <p>➡️ {t("following")}: <strong>{data.followingCount}</strong></p>
          </div>}

          <Notifications />
        </div>
        : <></>}
    </ErrorBoundary>
  )
}

export default ProfileSidebar
