import { Issues, IssuesSchema } from './issues/issues.schema';

import { IssuesController } from './issues/issues.controller';
import { IssuesMongoRepository } from './issues/issues.repository';
import { IssuesService } from './issues/issues.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017'),
    MongooseModule.forFeature([{ name: Issues.name, schema: IssuesSchema }]),
  ],
  controllers: [IssuesController],
  providers: [IssuesService, IssuesMongoRepository],
})
export class AppModule {}
