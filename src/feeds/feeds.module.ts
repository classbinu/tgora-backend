import { Feeds, FeedsSchema } from './feeds.schema';
import { FeedsMongoRepository, ImageUploadService } from './feeds.repository';

import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Feeds.name, schema: FeedsSchema }]),
  ],
  controllers: [FeedsController],
  providers: [FeedsService, FeedsMongoRepository, ImageUploadService],
  exports: [FeedsService],
})
export class FeedsModule {}
