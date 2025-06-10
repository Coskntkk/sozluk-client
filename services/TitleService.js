import api from "./api"

class TitleServiceClass {
    async getTitles(query) {
        let queryStr = new URLSearchParams(query)
        let res = await api.get(`/titles?${queryStr}`);
        return res
    };

    async getTitle(slug, query) {
        let queryStr = new URLSearchParams(query)
        let res = await api.get(`/titles/${slug}?${queryStr}`);
        return res
    };
};

const TitleService = new TitleServiceClass()
export default TitleService;