import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@Controller('feeds')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Get()
  getAllIFeeds() {
    return this.feedsService.getAllFeeds();
  }

  @Get('/:id')
  getFeed(@Param('id') id: string) {
    return this.feedsService.getFeed(id);
  }

  @Post()
  async createFeed(@Body() feedsDto, @Req() req: Request) {
    const user = req.user;
    return await this.feedsService.createFeed(feedsDto, user);
  }

  @Patch('/:id/likes')
  async updateFeedLike(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user['sub'];
    return await this.feedsService.updateFeedLike(id, userId);
  }

  @Patch('/:id/:field')
  async updateFeedField(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('field') field: string,
  ) {
    const userId = req.user['sub'];
    return await this.feedsService.updateFeedField(id, field, userId);
  }

  @Put('/:id')
  async updateFeed(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() feedsDto,
  ) {
    const userId = req.user['sub'];
    return await this.feedsService.updateFeed(id, feedsDto, userId);
  }

  @Delete('/:id')
  async deleteFeed(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.feedsService.deleteFeed(id, userId);
  }
}
