import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
