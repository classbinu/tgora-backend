export interface CommentsDto {
  userId: string;
  nickname: string;
  feedId: string;
  content: string;
  likes?: number;
  comments?: number;
  flags?: number;
  createdAt: Date;
}
