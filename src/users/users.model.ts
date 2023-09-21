export interface UsersDto {
  username: string;
  password: string;
  nickname: string[];
  email?: string;
  phone?: string;
  mentor: string;
  refreshToken: string | null;
  createdAt: Date;
}
