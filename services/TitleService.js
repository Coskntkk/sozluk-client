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

    async searchTitleBySlug(slug) {
        let res = await api.get(`/titles/search?slug=${slug}`);
        return res
    }

    async postEntryToTitle(titleId, message) {
        let res = await api.post(`/titles/${titleId}/entries`, { message });
        return res
    };

    async postEntryToNewTitle(name, message) {
        let res = await api.post(`/titles`, { name, message });
        return res
    }

};

const TitleService = new TitleServiceClass()
export default TitleService;