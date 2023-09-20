export interface FeedsDto {
  userId: string;
  nickname: string;
  title: string;
  content: string;
  likes?: string[];
  comments?: string[];
  views?: string[];
  flags?: string[];
  createdAt?: Date;
}
