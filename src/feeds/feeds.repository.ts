import { Feeds, FeedsDocument } from './feeds.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FeedsDto } from './feeds.model';
import { Model } from 'mongoose';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export interface FeedsRepository {
  getAllFeeds(channel: string, page: number): Promise<FeedsDto[]>;
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

  async getAllFeeds(channel: string, page: number): Promise<Feeds[]> {
    const channels = {
      elementary: '초등',
      middle: '중등',
      child: '유치원',
      special: '특수',
    };
    const pageSize = 200;
    const skip = (page - 1) * pageSize;

    const query = channel === 'every' ? {} : { channel: channels[channel] };

    return await this.feedsModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
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

@Injectable()
export class ImageUploadService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadImage(
    base64Image: string,
    bucketName: string,
    folderName: string,
  ): Promise<string> {
    try {
      // Base64 데이터를 Buffer로 변환
      const buffer = Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      // 이미지 확장자 검출
      const extensionMatch = base64Image.match(/^data:image\/(\w+);base64,/);
      const extension = extensionMatch ? extensionMatch[1] : 'jpg'; // 기본 확장자는 jpg

      // S3에 업로드할 파일명 생성 (예: unique-image-filename.jpg)
      const fileName = `${folderName}/${uuidv4()}.${extension}`;

      // S3에 이미지 업로드
      const uploadResult = await this.s3
        .upload({
          Bucket: bucketName,
          Key: fileName,
          Body: buffer,
          ACL: 'public-read', // 업로드된 이미지에 대한 퍼블릭 읽기 권한 설정
          ContentType: `image/${extension}`, // 이미지 포맷에 따라 변경
        })
        .promise();

      // 업로드된 이미지의 URL 반환
      return uploadResult.Location;
    } catch (error) {
      // 업로드 실패 시 오류 처리
      throw new Error('이미지 업로드에 실패했습니다. ' + error);
    }
  }

  async deleteImage(objectKey: string, bucketName: string): Promise<void> {
    try {
      const result = await this.s3
        .deleteObject({
          Bucket: bucketName,
          Key: objectKey,
        })
        .promise();
      console.log(result);
    } catch (error) {
      throw new Error('이미지 삭제에 실패했습니다. ' + error);
    }
  }
}
