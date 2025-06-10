import api from "./api"

class NotificationServiceClass {
    async getNotifications() {
        let res = await api.get(`/notification`);
        return res
    };

    async readNotification(notifId) {
        let res = await api.get(`/notification/${notifId}/read`);
        return res
    };
};

const NotificationService = new NotificationServiceClass()
export default NotificationService;