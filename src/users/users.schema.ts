import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  refreshToken: string | null;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
