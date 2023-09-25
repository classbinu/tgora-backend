import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  getAllComments() {
    return this.commentsService.getAllComments();
  }

  @Get('/my')
  async getMyComments(@Req() req: Request) {
    const userId = req.user['sub'];
    return await this.commentsService.getMyComments(userId);
  }

  @Get('/feed')
  getAllCommentsByFeedId(@Query() query) {
    const { feedId } = query;
    return this.commentsService.getAllCommentsByFeedId(feedId);
  }

  @Get('/:id')
  getComment(@Param('id') id: string) {
    return this.commentsService.getComment(id);
  }

  @Post()
  async createComment(@Body() commentsDto, @Req() req: Request) {
    const user = req.user;
    return await this.commentsService.createComment(commentsDto, user);
  }

  @Put('/:id')
  async updateComment(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() commentsDto,
  ) {
    const userId = req.user['sub'];
    return await this.commentsService.updateComment(id, commentsDto, userId);
  }

  @Delete('/:id')
  async deleteComment(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user['sub'];
    return this.commentsService.deleteComment(id, userId);
  }
}
