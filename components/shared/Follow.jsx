import UserService from '@/services/UserService';
import React from 'react'

const Follow = ({
    username,
    isFollowing,
    isOwn,
    onUse
}) => {
    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await UserService.unfollowUser(username);
            } else {
                await UserService.followUser(username);
            }
            onUse()
        } catch (err) {
            // TODO: Fix here
            console.log("Operation failed:", err);
        }
    }

    return (
        !isOwn && (
            <button
                onClick={handleFollowToggle}
                className={`text-sm px-3 py-1 rounded ${isFollowing ? "bg-gray-300 text-black" : "bg-sky-600 text-white"}`}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </button>
        )
    )
}

export default Follow