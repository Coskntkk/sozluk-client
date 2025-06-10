import api from "./api"

class EntryServiceClass {
    async getEntry(entryId) {
        let res = await api.get(`/entries/${entryId}`);
        return res
    };

    async voteEntry(entryId, value) {
        let res = await api.post(`/entries/${entryId}/votes`, { value });
        return res
    };

    async removeVoteEntry(entryId) {
        let res = await api.delete(`/entries/${entryId}/votes`);
        return res
    };

    async deleteEntry(entryId) {
        let res = await api.delete(`/entries/${entryId}`);
        return res
    };
};

const EntryService = new EntryServiceClass()
export default EntryService;