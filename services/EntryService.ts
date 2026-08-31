import api from './api';
import { ApiResponse, Entry, CreateEntryDto, UpdateEntryDto, VoteDto } from '@/types';

class EntryServiceClass {
  async getEntry(entryId: number | string): Promise<ApiResponse<Entry>> {
    const res = await api.get(`/entries/${entryId}`);
    return res.data;
  }

  async createEntry(dto: CreateEntryDto): Promise<ApiResponse<Entry>> {
    const res = await api.post('/entries', dto);
    return res.data;
  }

  async createEntryUnderTitle(titleId: number | string, message: string): Promise<ApiResponse<Entry>> {
    const res = await api.post(`/titles/${titleId}/entries`, { message });
    return res.data;
  }

  async updateEntry(entryId: number | string, dto: UpdateEntryDto): Promise<ApiResponse<Entry>> {
    const res = await api.put(`/entries/${entryId}`, dto);
    return res.data;
  }

  async deleteEntry(entryId: number | string): Promise<ApiResponse<{ success: boolean }>> {
    const res = await api.delete(`/entries/${entryId}`);
    return res.data;
  }

  async voteEntry(entryId: number | string, value: 1 | -1): Promise<ApiResponse<any>> {
    const res = await api.post(`/entries/${entryId}/vote`, { value });
    return res.data;
  }

  async removeVoteEntry(entryId: number | string): Promise<ApiResponse<any>> {
    const res = await api.delete(`/entries/${entryId}/vote`);
    return res.data;
  }

  async reportEntry(entryId: number | string, note: string): Promise<ApiResponse<any>> {
    const res = await api.post(`/moderation/entries/${entryId}/report`, { note });
    return res.data;
  }
}

const EntryService = new EntryServiceClass();
export default EntryService;
