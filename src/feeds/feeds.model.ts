export interface FeedsDto {
  userId: string;
  nickname: string;
  channel: string;
  title: string;
  content: string;
  likes?: string[];
  comments?: string[];
  views?: string[];
  flags?: string[];
  createdAt?: Date;
}
