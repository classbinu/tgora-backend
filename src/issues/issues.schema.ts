import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type IssuesDocument = Issues & Document;

@Schema()
export class Issues {
  @Prop()
  category: string;

  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  summary: string;

  @Prop()
  dueDate: Date;

  @Prop()
  isPublic: string;

  @Prop()
  adminMemo: string;

  @Prop()
  createdAt: Date;
}

export const IssuesSchema = SchemaFactory.createForClass(Issues);
