import TitleService from './TitleService';
import api from './api';
import { ApiResponse, Title, Entry } from '@/types';

class HomeServiceClass {
  async getLatestTopic(): Promise<ApiResponse<{ title: Title; items: Entry[] }>> {
    try {
      // Use GET /api/titles?limit=1&sort=updatedAt&order=desc to get the latest active topic
      const res = await TitleService.getTitles({ limit: 1, sort: 'updatedAt', order: 'desc' });
      const data: any = res.data?.titles || res.data || [];
      const items: Title[] = Array.isArray(data) ? data : data?.titles || data?.items || [];

      if (items.length > 0) {
        const topTitle = items[0];
        // If the title already includes entries from the backend
        const directEntries: Entry[] = Array.isArray(topTitle.entries)
          ? topTitle.entries
          : (topTitle.entries as any)?.items || [];

        if (directEntries.length > 0) {
          return {
            success: true,
            data: {
              title: topTitle,
              items: directEntries,
            },
          };
        }

        // Otherwise fetch detail by slug
        const detailRes = await api.get(`/titles/${topTitle.slug}?limit=10`);
        const detailData = detailRes.data?.data || detailRes.data;
        const entries = Array.isArray(detailData?.entries)
          ? detailData.entries
          : detailData?.entries?.items || detailData?.items || [];

        return {
          success: true,
          data: {
            title: detailData?.title || topTitle,
            items: entries,
          },
        };
      }
    } catch {
      // Fallback
    }

    return {
      success: false,
      data: {
        title: { id: 0, name: 'Welcome to Sözlük', slug: 'welcome', createdAt: new Date().toISOString() },
        items: [],
      },
    };
  }
}

const HomeService = new HomeServiceClass();
export default HomeService;
