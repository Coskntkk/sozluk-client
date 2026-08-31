export enum UserRole {
  ROOKIE = 1,
  AUTHOR = 2,
  MODERATOR = 3,
  ADMIN = 4,
}

export interface Role {
  id: number;
  name: 'Rookie' | 'Author' | 'Moderator' | 'Admin' | string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  roleId: number;
  role?: Role | string;
  imageUrl?: string | null;
  image_url?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  followerCount: number;
  followingCount: number;
  entryCount?: number;
  isFollowing?: boolean | string;
}

export interface UserStats {
  entryCount: number;
  followerCount: number;
  followingCount: number;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface UpdateUserDto {
  imageUrl?: string;
  bio?: string;
}
