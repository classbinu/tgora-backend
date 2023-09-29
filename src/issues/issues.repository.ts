import { Issues, IssuesDocument } from './issues.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { IssuesDto } from './issues.model';
import { Model } from 'mongoose';

export interface IssuesRepository {
  getAllIssues(state: string, isPublic: string): Promise<IssuesDto[]>;
  getParticipants(): Promise<number>;
  getMyParticipatedIssuesCount(userId: string);
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
    currentDate.setTime(currentDate.getTime() - 15 * 60 * 60 * 1000); //시간 빼기
    const queryConditions: any = {
      isPublic: '',
      dueDate: {},
    };

    const sortConditions: any = {
      dueDate: 1,
      createdAt: -1,
    };

    if (state === 'open') {
      queryConditions.dueDate = { $gte: currentDate };
    } else if (state === 'closed') {
      queryConditions.dueDate = { $lt: currentDate };
      sortConditions.dueDate = -1;
    } else if (state === 'all') {
      delete queryConditions.dueDate;
      sortConditions.dueDate = -1;
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
      .sort(sortConditions)
      .exec();
  }

  async getParticipants(): Promise<number> {
    const totalParticipants = await this.issuesModel.aggregate([
      {
        $group: {
          _id: null, // 모든 문서를 하나의 그룹으로 그룹화합니다.
          total: {
            $sum: { $size: '$participants' }, // participants 배열의 길이를 합산합니다.
          },
        },
      },
    ]);
    if (totalParticipants.length > 0) {
      return totalParticipants[0].total;
    } else {
      return 0;
    }
  }

  async getMyParticipatedIssuesCount(userId: string) {
    const totalIssueCount = await this.issuesModel.countDocuments({
      isPublic: '공개',
    });
    const participatedIssuesCount = await this.issuesModel.countDocuments({
      participants: userId,
    });
    return { participatedIssuesCount, totalIssueCount };
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
