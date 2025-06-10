import api from "./api"

class HomeServiceClass {
    async getLeftframe() {
        let res = await api.get(`/home/leftframe`);
        return res
    };

    async getRightframe() {
        let res = await api.get(`/home/rightframe`);
        return res
    };

    async getLastTitle() {
        let res = await api.get(`/home/latest`);
        return res
    };
};

const HomeService = new HomeServiceClass()
export default HomeService;