import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Get()
  getAllIssues() {
    return this.issuesService.getAllIssues();
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
    return this.issuesService.updateIssue(id, issuesDto);
  }
}