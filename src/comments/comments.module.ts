import { Comments, CommentsSchema } from './comments.schema';

import { CommentsController } from './comments.controller';
import { CommentsMongoRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { FeedsModule } from 'src/feeds/feeds.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    FeedsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsMongoRepository],
})
export class CommentsModule {}
