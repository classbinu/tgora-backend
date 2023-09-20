import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { FeedsDto } from './feeds.model';
import { FeedsMongoRepository } from './feeds.repository';

@Injectable()
export class FeedsService {
  constructor(private feedsRepository: FeedsMongoRepository) {}

  async getAllFeeds() {
    return await this.feedsRepository.getAllFeeds();
  }

  async getFeed(id) {
    const feed = await this.feedsRepository.getFeed(id);
    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }
    return feed;
  }

  async createFeed(feedsDto: FeedsDto, user) {
    const userId = user.sub;
    const nickname = user.nickname;
    const createFeed = {
      ...feedsDto,
      userId,
      nickname,
    };
    await this.feedsRepository.createFeed(createFeed);
  }

  async updateFeed(id: string, feedsDto: FeedsDto, userId: string) {
    const feed = await this.feedsRepository.getFeed(id);

    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    if (feed.userId !== userId) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    }
    return await this.feedsRepository.updateFeed(id, feedsDto);
  }

  async deleteFeed(id: string, userId: string) {
    const feed = await this.feedsRepository.getFeed(id);

    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    if (feed.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }
    return await this.feedsRepository.deleteFeed(id);
  }

  async updateFeedWithoutAuth(id, field, userId) {
    const allowedFields = ['views', 'likes', 'flags'];

    if (!allowedFields.includes(field)) {
      throw new NotFoundException('유효하지 않은 필드입니다.');
    }

    const feed = await this.feedsRepository.getFeed(id);
    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }
    return await this.feedsRepository.updateFeedWithoutAuth(id, field, userId);
  }
}
