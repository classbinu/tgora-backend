export interface IssuesDto {
  category: string;
  title: string;
  link: string;
  summary: string;
  dueDate: Date;
  participants?: string[];
  nonParticipants?: string[];
  isPublic: string;
  isNotice: boolean;
  adminMemo: string;
  createdAt: Date;
}
