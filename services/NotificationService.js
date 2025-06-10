import api from "./api"

class NotificationServiceClass {
    async getNotifications(query) {
        let queryStr = new URLSearchParams(query)
        let res = await api.get(`/notification?${queryStr}`);
        return res
    };

    async readNotification(notifId) {
        let res = await api.get(`/notification/${notifId}/read`);
        return res
    };
};

const NotificationService = new NotificationServiceClass()
export default NotificationService;