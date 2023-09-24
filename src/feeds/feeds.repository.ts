import { Feeds, FeedsDocument } from './feeds.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FeedsDto } from './feeds.model';
import { Model } from 'mongoose';

export interface FeedsRepository {
  getAllFeeds(channel: string): Promise<FeedsDto[]>;
  getMyFeeds(userId: string): Promise<FeedsDto[]>;
  createFeed(feedsDto: FeedsDto);
  updateFeed(id: string, feedsDto: FeedsDto);
  deleteFeed(id: string);
  updateFeedLike(type: string, id: string, userId: string);
  updateFeedField(id, field, userId);
  updateFeedCommentsWithoutAuth(type, feedId, commentId);
}

@Injectable()
export class FeedsMongoRepository implements FeedsRepository {
  constructor(
    @InjectModel(Feeds.name) private feedsModel: Model<FeedsDocument>,
  ) {}

  async getAllFeeds(channel: string): Promise<Feeds[]> {
    const channels = {
      elementary: '초등',
      middle: '중등',
      child: '유치원',
      special: '특수',
    };
    const query = channel === 'every' ? {} : { channel: channels[channel] };

    return await this.feedsModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async getMyFeeds(userId: string) {
    const feeds = await this.feedsModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });
    return feeds;
  }

  async getFeed(id: string): Promise<Feeds> {
    const feed = await this.feedsModel.findById(id);
    return feed;
  }

  async createFeed(feedsDto: FeedsDto) {
    return await this.feedsModel.create(feedsDto);
  }

  async updateFeed(id: string, feedsDto: FeedsDto) {
    const updateFeed = { ...feedsDto };
    return await this.feedsModel.findByIdAndUpdate(id, updateFeed, {
      new: true,
    });
  }

  async deleteFeed(id: string) {
    return await this.feedsModel.findByIdAndDelete(id);
  }

  async updateFeedLike(type: string, id: string, userId: string) {
    let updateQuery;
    if (type === 'push') {
      updateQuery = {
        $addToSet: { likes: userId },
      };
    } else if (type === 'pop') {
      updateQuery = {
        $pull: { likes: userId },
      };
    }
    return await this.feedsModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });
  }

  async updateFeedField(id: string, field: string, userId: string) {
    return await this.feedsModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { [field]: userId },
      },
      {
        new: true,
      },
    );
  }

  async updateFeedCommentsWithoutAuth(type, feedId: string, commentId: string) {
    let updateQuery;
    if (type === 'push') {
      updateQuery = {
        $addToSet: { comments: commentId },
      };
    } else if (type === 'pop') {
      updateQuery = {
        $pull: { comments: commentId },
      };
    }
    return await this.feedsModel.findByIdAndUpdate(feedId, updateQuery, {
      new: true,
    });
  }
}
