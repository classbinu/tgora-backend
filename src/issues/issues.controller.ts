import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Get()
  getAllIssues(@Query() query) {
    const { state, isPublic } = query;
    return this.issuesService.getAllIssues(state, isPublic);
  }

  @Get('/:id')
  getIssue(@Param('id') id: string) {
    return this.issuesService.getIssue(id);
  }

  @Post()
  createIssue(@Body() issuesDto) {
    this.issuesService.createIssue(issuesDto);
    return 'success';
  }

  @Delete('/:id')
  deleteIssue(@Param('id') id: string) {
    this.issuesService.deleteIssue(id);
    return 'success';
  }

  @Put('/:id')
  updateIssue(@Param('id') id: string, @Body() issuesDto) {
    console.log(issuesDto);
    return this.issuesService.updateIssue(id, issuesDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/:issueId/participants')
  async updateIssueParticipants(
    @Req() req: Request,
    @Param('issueId') id: string,
  ) {
    const userId = req.user['sub'];
    return await this.issuesService.updateIssueParticipants(id, userId);
  }
}
