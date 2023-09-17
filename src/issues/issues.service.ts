import { Injectable } from '@nestjs/common';
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

  createIssue(issuesDto: IssuesDto) {
    this.issuesRepository.createIssue(issuesDto);
  }

  deleteIssue(id) {
    this.issuesRepository.deleteIssue(id);
  }

  updateIssue(id, issuesDto: IssuesDto) {
    this.issuesRepository.updateIssue(id, issuesDto);
  }
}
