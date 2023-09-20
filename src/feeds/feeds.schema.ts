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

  @Prop([String])
  likes: string[];

  @Prop({ default: 0 })
  comments: number;

  @Prop([String])
  views: string[];

  @Prop([String])
  flags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FeedsSchema = SchemaFactory.createForClass(Feeds);
