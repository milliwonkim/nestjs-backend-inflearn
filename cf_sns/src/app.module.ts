import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { PostsModel } from './posts/entities/posts.entity';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      // 데이터베이스 타입
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres', // 추후에 환경 변수를 사용하여 변경할 예정
      database: 'postgres',
      entities: [PostsModel, UsersModel],
      synchronize: true, // nestjs에서의 typeorm 코드와 database의 동기화 여부 -> production 환경에서는 false로 하는 것이 좋다.
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
