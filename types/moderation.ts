import { User } from './user';
import { Entry } from './entry';

export enum ReportStatusId {
  OPEN = 1,
  REJECTED = 2,
  ACCEPTED = 3,
}

export interface ReportStatus {
  id: ReportStatusId;
  name: 'Open' | 'Rejected' | 'Accepted' | string;
}

export interface Report {
  id: number;
  note: string;
  entryId: number;
  reporterId: number;
  statusId: ReportStatusId;
  createdAt: string;
  updatedAt?: string;
  entry?: Entry;
  reporter?: User;
  status?: ReportStatus;
}

export interface CreateReportDto {
  note: string;
}

export interface UpdateReportDto {
  statusId: ReportStatusId.REJECTED | ReportStatusId.ACCEPTED | number;
}

export interface RookieEntry extends Entry {
  isApproved?: boolean;
}

export interface UpdateUserRoleDto {
  roleId: number;
}

export interface AdminStats {
  users: {
    total: number;
    authors: number;
    rookies: number;
    moderators: number;
    admins: number;
    newToday?: number;
  };
  content: {
    totalTitles: number;
    newTitlesToday?: number;
    totalEntries: number;
    newEntriesToday?: number;
    deletedEntries?: number;
  };
  moderation: {
    pendingRookieEntries: number;
    openReports: number;
    resolvedReports?: number;
  };
  engagement: {
    totalVotes: number;
    upvotes: number;
    downvotes: number;
    follows?: number;
  };
}
