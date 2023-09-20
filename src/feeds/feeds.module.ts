import { Feeds, FeedsSchema } from './feeds.schema';

import { FeedsController } from './feeds.controller';
import { FeedsMongoRepository } from './feeds.repository';
import { FeedsService } from './feeds.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feeds.name, schema: FeedsSchema }]),
  ],
  controllers: [FeedsController],
  providers: [FeedsService, FeedsMongoRepository],
  exports: [FeedsService],
})
export class FeedsModule {}
