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
        axios.post(`${apiUrl}/users/${username}/follow`)
    };
    
    async unfollowUser(username) {
        axios.post(`${apiUrl}/users/${username}/unfollow`)
    };
};

const UserService = new UserServiceClass()
export default UserService;