import { Injectable, NotFoundException } from '@nestjs/common';

import { IssuesDto } from './issues.model';
import { IssuesMongoRepository } from './issues.repository';

@Injectable()
export class IssuesService {
  constructor(private issuesRepository: IssuesMongoRepository) {}

  async getAllIssues(state: string, isPublic: string) {
    return await this.issuesRepository.getAllIssues(state, isPublic);
  }

  async getIssue(id) {
    return await this.issuesRepository.getIssue(id);
  }

  async createIssue(issuesDto: IssuesDto) {
    return await this.issuesRepository.createIssue(issuesDto);
  }

  async deleteIssue(id) {
    return this.issuesRepository.deleteIssue(id);
  }

  async updateIssue(id, issuesDto: IssuesDto) {
    return this.issuesRepository.updateIssue(id, issuesDto);
  }

  async updateIssueParticipants(issueId: string, userId: string) {
    const issue = await this.issuesRepository.getIssue(issueId);
    if (!issue) {
      throw new NotFoundException('이슈를 찾을 수 없습니다.');
    }

    let type: string;
    if (issue['participants'].includes(userId)) {
      type = 'pop';
    } else {
      type = 'push';
    }
    return this.issuesRepository.updateIssueParticipants(type, issueId, userId);
  }
}
