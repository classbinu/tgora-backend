import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

function generateRandomNickname() {
  const characters = 'Ii';
  let result = '';

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  grade: string;

  @Prop({ type: [String], default: generateRandomNickname })
  nickname: string[];

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  mentor: string;

  @Prop()
  refreshToken: string | null;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
