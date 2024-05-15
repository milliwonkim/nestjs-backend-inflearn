import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 데이터베이스에는 저장은 안함
    // const user1 = this.userRepository.create({
    //   email: 'test@codefactory.ai',
    // });

    // 데이터베이스를 토대로 객체 생성
    // const user2 = await this.userRepository.save({
    //   email: 'test@codefactory.ai',
    // });

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함
    // 저장하지는 않음
    //
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'codefactory@codefactory.ai',
    // });

    // 삭제하기
    // await this.userRepository.delete(101);

    // await this.userRepository.increment(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );

    // await this.userRepository.decrement(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   1,
    // );

    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });
    //
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });

    // const average = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });

    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });

    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });

    const userAndCount = await this.userRepository.findAndCount({
      take: 20,
    });

    return userAndCount;
  }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
  }

  @Get('users')
  getUsers(): Promise<UserModel[]> {
    return this.userRepository.find({
      where: {
        // 아닌 경우 가져오기
        // id: Not(1),
        // 보다 적은 경우 가져오기
        // id: LessThan(30),
        // 적은 경우 or 같은 경우
        // id: LessThanOrEqual(30),
        // 많은 경우
        // id: MoreThan(30),
        // 많거나 같은 경우
        // id: MoreThanOrEqual(30),
        // id: Equal(30),
        // email: Like('%0%'),
        // 대문자 소문자 구분 안하는 유사값
        // email: ILike('%GOOGLE%'),
        // id: Between(10, 15),
        // 해당되는 여러 개의 값
        // id: In([1, 4, 6, 99]),
        // 값이 NULL인 경우 가져오기
        // id: IsNull(),
      },
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져온다.
      // 만약에 select를 정의하지 않으면 모든 프로퍼티
      // select를 정의하면 정의된 프로퍼티들만 가져온다.
      // select: {
      //   id: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   version: true,
      //   profile: {
      //     id: true,
      //   },
      // },
      // 필터링할 조건을 입력하게 된다.
      // 관계를 가져오는 법
      // relations: {
      //   profile: true,
      // },
      // 오름차 내림차
      // ASC - > 오름차
      // DESC -> 내림차
      order: {
        id: 'ASC',
      },
      // 처음 몇개를 제외할 지
      // skip: 0,
      // 몇개를 가져올 지
      // take: 0,
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
      email: user.email + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@gmail.com',
      profile: {
        profileImg: 'asdf.jpg ',
      },
    });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@codefactory.ai',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post1],
    });

    await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
