import api from './api';
import {
  ApiResponse,
  Title,
  TitleDetail,
  CreateTitleDto,
  TitleQuery,
  TitlesResponseData,
} from '@/types';

class TitleServiceClass {
  async getTitles(query?: TitleQuery): Promise<ApiResponse<TitlesResponseData>> {
    const params: Record<string, any> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;
    if (query?.search) params.search = query.search;
    if (query?.sort) params.sort = query.sort;
    if (query?.order) params.order = query.order;
    if (query?.today) params.today = query.today;

    const queryStr = new URLSearchParams(params).toString();
    const res = await api.get(`/titles${queryStr ? `?${queryStr}` : ''}`);
    return res.data;
  }

  async getTitle(
    idOrSlug: string | number,
    query?: { page?: number; limit?: number }
  ): Promise<ApiResponse<TitleDetail>> {
    const params: Record<string, any> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;

    const queryStr = new URLSearchParams(params).toString();
    const res = await api.get(`/titles/${idOrSlug}${queryStr ? `?${queryStr}` : ''}`);
    return res.data;
  }

  async createTitle(dto: CreateTitleDto): Promise<ApiResponse<Title>> {
    const res = await api.post('/titles', dto);
    return res.data;
  }

  async postEntryToTitle(titleId: number | string, message: string): Promise<ApiResponse<any>> {
    const res = await api.post(`/titles/${titleId}/entries`, { message });
    return res.data;
  }

  async searchTitles(search: string): Promise<ApiResponse<TitlesResponseData>> {
    const res = await api.get(`/titles?search=${encodeURIComponent(search)}&limit=10`);
    return res.data;
  }
}

const TitleService = new TitleServiceClass();
export default TitleService;
