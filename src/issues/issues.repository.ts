import { Issues, IssuesDocument } from './issues.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { IssuesDto } from './issues.model';
import { Model } from 'mongoose';

export interface IssuesRepository {
  getAllIssues(): Promise<IssuesDto[]>;
  createIssue(issuesDto: IssuesDto);
  deleteIssue(id: string);
  updateIssue(id: string, issuesDto: IssuesDto);
}

@Injectable()
export class IssuesMongoRepository implements IssuesRepository {
  constructor(
    @InjectModel(Issues.name) private issuesModel: Model<IssuesDocument>,
  ) {}

  async getAllIssues(): Promise<Issues[]> {
    return await this.issuesModel.find().sort({ dueDate: 1 }).exec();
  }

  async getIssue(id: string): Promise<Issues> {
    return await this.issuesModel.findById(id);
  }

  async createIssue(issuesDto: IssuesDto) {
    const createIssue = {
      ...issuesDto,
      createdAt: new Date(),
    };
    this.issuesModel.create(createIssue);
  }

  async deleteIssue(id: string) {
    await this.issuesModel.findByIdAndDelete(id);
  }

  async updateIssue(id: string, issuesDto: IssuesDto) {
    const updateIssue = { ...issuesDto };
    await this.issuesModel.findByIdAndUpdate(id, updateIssue);
  }
}
