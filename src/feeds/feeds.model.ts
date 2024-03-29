export interface FeedsDto {
  userId: string;
  grade?: string;
  nickname: string;
  channel: string;
  title: string;
  content: string;
  image?: string;
  likes?: string[];
  comments?: string[];
  views?: string[];
  flags?: string[];
  createdAt?: Date;
}
