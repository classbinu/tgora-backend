export interface FeedsDto {
  userId: string;
  nickname: string;
  title: string;
  content: string;
  likes?: number;
  comments?: number;
  views?: number;
  flags?: number;
  createdAt: Date;
}
