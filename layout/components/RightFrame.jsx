import Link from "next/link"
import Image from "next/image"
import moment from "moment"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import HomeService from "@/services/HomeService";
import Notifications from "@/components/shared/Notifications";

const ProfileSidebar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({
    isError: false,
    message: ''
  })

  const getData = () => {
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
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (isAuthenticated
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
          <p className="text-lg font-bold text-sky-700">{user.username}</p>
          <p className="text-sm text-gray-500">Joined: {moment(user.createdAt).format("DD.MM.YYYY")}</p>
        </div>
      </div>

      {data && <div className="text-sm text-gray-700 space-y-1 mb-4">
        <p>✍️ Entry count: <strong>{data.entryCount}</strong></p>
        <p>👥 Follower: <strong>{data.followerCount}</strong></p>
        <p>➡️ Following: <strong>{data.followingCount}</strong></p>
      </div>}

      <Notifications />
    </div>
    : <></>
  )
}

export default ProfileSidebar
