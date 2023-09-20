import { Feeds, FeedsDocument } from './feeds.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FeedsDto } from './feeds.model';
import { Model } from 'mongoose';

export interface FeedsRepository {
  getAllFeeds(): Promise<FeedsDto[]>;
  createFeed(feedsDto: FeedsDto);
  updateFeed(id: string, feedsDto: FeedsDto);
  deleteFeed(id: string);
}

@Injectable()
export class FeedsMongoRepository implements FeedsRepository {
  constructor(
    @InjectModel(Feeds.name) private feedsModel: Model<FeedsDocument>,
  ) {}

  async getAllFeeds(): Promise<Feeds[]> {
    return await this.feedsModel.find().sort({ createdAt: -1 }).exec();
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
}
