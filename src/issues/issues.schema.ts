import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type IssuesDocument = Issues & Document;

@Schema()
export class Issues {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop()
  summary: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop([String])
  participants: string[];

  @Prop({ required: true })
  isPublic: string;

  @Prop({ required: true, default: false })
  isNotice: boolean;

  @Prop()
  adminMemo: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const IssuesSchema = SchemaFactory.createForClass(Issues);
