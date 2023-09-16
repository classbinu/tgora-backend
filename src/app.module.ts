import { AuthModule } from './auth/auth.module';
import { IssuesModule } from './issues/issues.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    // MongooseModule.forRoot(process.env.DB_URL),
    MongooseModule.forRoot('mongodb://localhost:27017'),
    IssuesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
