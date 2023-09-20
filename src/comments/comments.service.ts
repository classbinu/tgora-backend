import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CommentsDto } from './comments.model';
import { CommentsMongoRepository } from './comments.repository';
import { FeedsService } from 'src/feeds/feeds.service';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsMongoRepository,
    private feedsService: FeedsService,
  ) {}

  async getAllComments() {
    return await this.commentsRepository.getAllComments();
  }

  async getAllCommentsByFeedId(feedId: string) {
    const feed = await this.feedsService.getFeed(feedId);
    if (!feed) {
      throw new HttpException(
        '피드가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.commentsRepository.getAllCommentsByFeedId(feedId);
  }

  async getComment(id) {
    const comment = await this.commentsRepository.getComment(id);
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  async createComment(commentsDto: CommentsDto, user) {
    const feed = await this.feedsService.getFeed(commentsDto.feedId);
    if (!feed) {
      throw new HttpException(
        '피드가 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userId = user.sub;
    const nickname = user.nickname;
    const createComment = {
      ...commentsDto,
      userId,
      nickname,
    };
    const newComment =
      await this.commentsRepository.createComment(createComment);
    await this.feedsService.updateFeedCommentsWithoutAuth(
      'push',
      newComment.feedId,
      newComment._id,
    );
    return newComment;
  }

  async updateComment(id: string, commentsDto: CommentsDto, userId: string) {
    const comment = await this.commentsRepository.getComment(id);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    }
    return await this.commentsRepository.updateComment(id, commentsDto);
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.commentsRepository.getComment(id);

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }

    const deletedComment = await this.commentsRepository.deleteComment(id);
    await this.feedsService.updateFeedCommentsWithoutAuth(
      'pop',
      deletedComment.feedId,
      deletedComment._id,
    );
    return deletedComment;
  }
}
