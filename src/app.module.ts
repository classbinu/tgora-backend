import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { FeedsModule } from './feeds/feeds.module';
import { IssuesModule } from './issues/issues.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

console.log('env : ' + process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL), //LOCAL_DB_URL
    IssuesModule,
    AuthModule,
    UsersModule,
    FeedsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
