import { User } from './user';
import { Title } from './title';

export interface Entry {
  id: number;
  message: string;
  titleId: number;
  userId: number;
  point?: number;
  score?: number;
  voteScore?: number;
  userVote?: number; // 1, -1, or 0 / undefined
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  user?: User;
  author?: User;
  title?: Title;
}

export interface CreateEntryDto {
  message: string;
  titleId?: number;
}

export interface UpdateEntryDto {
  message: string;
}

export interface VoteDto {
  value: 1 | -1;
}

export interface EntryVoteResponse {
  entryId: number;
  value: number;
  score: number;
}
