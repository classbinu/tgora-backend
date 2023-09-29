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

  async getAllFeeds(channel: string, page: number) {
    return await this.feedsRepository.getAllFeeds(channel, page);
  }

  async getMyFeeds(userId: string) {
    const feeds = await this.feedsRepository.getMyFeeds(userId);
    if (!feeds) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }
    return feeds;
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
    const grade = user.grade;
    const nickname = user.nickname;
    const createFeed = {
      ...feedsDto,
      userId,
      grade,
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

  async updateFeedLike(id, userId) {
    const feed = await this.feedsRepository.getFeed(id);
    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    let type: string;
    if (feed['likes'].includes(userId)) {
      type = 'pop';
    } else {
      type = 'push';
    }
    return await this.feedsRepository.updateFeedLike(type, id, userId);
  }

  async updateFeedField(id, field, userId) {
    const allowedFields = ['views', 'flags'];

    if (!allowedFields.includes(field)) {
      throw new NotFoundException('유효하지 않은 필드입니다.');
    }

    const feed = await this.feedsRepository.getFeed(id);
    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }
    return await this.feedsRepository.updateFeedField(id, field, userId);
  }

  async updateFeedCommentsWithoutAuth(
    type: string,
    feedId: string,
    commentId: string,
  ) {
    const feed = await this.feedsRepository.getFeed(feedId);
    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }
    return await this.feedsRepository.updateFeedCommentsWithoutAuth(
      type,
      feedId,
      commentId,
    );
  }
}
