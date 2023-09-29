export interface UsersDto {
  username: string;
  password: string;
  grade: string;
  nickname: string[];
  email?: string;
  phone?: string;
  mentor: string;
  refreshToken: string | null;
  createdAt: Date;
}
