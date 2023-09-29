export interface CommentsDto {
  userId: string;
  grade: string;
  nickname: string;
  feedId: string;
  content: string;
  likes?: number;
  comments?: number;
  flags?: number;
  createdAt: Date;
}
