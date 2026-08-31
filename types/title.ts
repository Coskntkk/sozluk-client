import { Entry } from './entry';
import { User } from './user';
import { PaginatedResponse } from './api';

export interface Title {
  id: number;
  name: string;
  slug: string;
  entry_count?: number;
  entryCount?: number;
  totalEntryCount?: number;
  todayEntryCount?: number;
  author?: User | null;
  user?: User | null;
  entries?: Entry[] | PaginatedResponse<Entry>;
  recentEntries?: Entry[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTitleDto {
  name: string;
}

export interface TitleDetail extends Title {
  entries?: PaginatedResponse<Entry> | Entry[];
}

export interface TitleQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'updatedAt' | 'createdAt' | 'name' | 'entries' | 'today' | 'latest' | string;
  order?: 'asc' | 'desc' | 'ASC' | 'DESC';
  today?: boolean;
}

export interface TitlesResponseData {
  titles: Title[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
