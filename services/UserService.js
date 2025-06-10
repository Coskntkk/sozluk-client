import api from "./api"

class UserServiceClass {
    async getUser(id) {
        let res = await api.get(`/users/${id}`);
        return res
    };

    async getUserEntries(id, query) {
        let queryStr = new URLSearchParams(query)
        let res = await api.get(`/users/${id}/entries?${queryStr}`);
        return res
    };

    async followUser(username) {
        let res = await api.get(`/users/${username}/follow`)
        return res
    };
    
    async unfollowUser(username) {
        let res = await api.delete(`/users/${username}/unfollow`)
        return res
    };
};

const UserService = new UserServiceClass()
export default UserService;