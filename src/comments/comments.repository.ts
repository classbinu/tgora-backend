import { Comments, CommentsDocument } from './comments.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CommentsDto } from './comments.model';
import { Model } from 'mongoose';

export interface CommentsRepository {
  getAllComments(): Promise<CommentsDto[]>;
  getAllCommentsByFeedId(feedId: string): Promise<Comments[]>;
  createComment(commentsDto: CommentsDto);
  updateComment(id: string, commentsDto: CommentsDto);
  deleteComment(id: string);
}

@Injectable()
export class CommentsMongoRepository implements CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private commentsModel: Model<CommentsDocument>,
  ) {}

  async getAllComments(): Promise<Comments[]> {
    return await this.commentsModel.find().sort({ createdAt: -1 }).exec();
  }

  async getAllCommentsByFeedId(feedId: string): Promise<Comments[]> {
    return await this.commentsModel
      .find({ feedId: feedId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getComment(id: string): Promise<Comments> {
    const comment = await this.commentsModel.findById(id);
    return comment;
  }

  async createComment(commentsDto: CommentsDto) {
    const newComment = await this.commentsModel.create(commentsDto);
    return newComment;
  }

  async updateComment(id: string, commentsDto: CommentsDto) {
    const updateComment = { ...commentsDto };
    return await this.commentsModel.findByIdAndUpdate(id, updateComment, {
      new: true,
    });
  }

  async deleteComment(id: string) {
    return await this.commentsModel.findByIdAndDelete(id);
  }
}
