import { Injectable } from '@nestjs/common';
import { IssuesDto } from './issues.model';
import { IssuesMongoRepository } from './issues.repository';

@Injectable()
export class IssuesService {
  constructor(private issuesRepository: IssuesMongoRepository) {}

  async getAllIssues() {
    return await this.issuesRepository.getAllIssues();
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

  updateIssue(id, issueDto: IssuesDto) {
    this.issuesRepository.updateIssue(id, issueDto);
  }
}
