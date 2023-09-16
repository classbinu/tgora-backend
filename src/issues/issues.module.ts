import { Issues, IssuesSchema } from './issues.schema';

import { IssuesController } from './issues.controller';
import { IssuesMongoRepository } from './issues.repository';
import { IssuesService } from './issues.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Issues.name, schema: IssuesSchema }]),
  ],
  controllers: [IssuesController],
  providers: [IssuesService, IssuesMongoRepository],
})
export class IssuesModule {}
