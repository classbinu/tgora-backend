import { Issues, IssuesDocument } from './issues.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { IssuesDto } from './issues.model';
import { Model } from 'mongoose';

export interface IssuesRepository {
  getAllIssues(state: string, isPublic: string): Promise<IssuesDto[]>;
  createIssue(issuesDto: IssuesDto);
  deleteIssue(id: string);
  updateIssue(id: string, issuesDto: IssuesDto);
}

@Injectable()
export class IssuesMongoRepository implements IssuesRepository {
  constructor(
    @InjectModel(Issues.name) private issuesModel: Model<IssuesDocument>,
  ) {}

  async getAllIssues(
    state: string | undefined,
    isPublic: string | undefined,
  ): Promise<Issues[]> {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() - 9 * 60 * 60 * 1000); //시간 빼기
    const queryConditions = {
      isPublic: '',
      dueDate: {},
    };

    if (state === 'open') {
      queryConditions.dueDate = { $gte: currentDate };
    } else if (state === 'closed') {
      queryConditions.dueDate = { $lt: currentDate };
    } else if (state === 'all') {
      delete queryConditions.dueDate;
    }

    if (isPublic === 'public') {
      queryConditions.isPublic = '공개';
    } else if (isPublic === 'private') {
      queryConditions.isPublic = '비공개';
    } else if (state === 'all') {
      delete queryConditions.isPublic;
    }

    return await this.issuesModel
      .find(queryConditions)
      .sort({ dueDate: 1 })
      .exec();
  }

  async getIssue(id: string): Promise<Issues> {
    return await this.issuesModel.findById(id);
  }

  async createIssue(issuesDto: IssuesDto) {
    const createIssue = {
      ...issuesDto,
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

  async updateIssueParticipants(type: string, issueId: string, userId: string) {
    let updateQuery;
    if (type === 'push') {
      updateQuery = {
        $addToSet: { participants: userId },
      };
    } else if (type === 'pop') {
      updateQuery = {
        $pull: { participants: userId },
      };
    }
    return await this.issuesModel.findByIdAndUpdate(issueId, updateQuery, {
      new: true,
    });
  }
}
