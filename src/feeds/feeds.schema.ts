import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type FeedsDocument = Feeds & Document;

@Schema()
export class Feeds {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  flags: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FeedsSchema = SchemaFactory.createForClass(Feeds);
