import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsModel } from './entities/posts.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 post를 다 가져온다.
  @Get()
  getPosts(): Promise<PostsModel[]> {
    return this.postsService.getAllPost();
  }

  // 2) GET /posts/:id
  // id에 해당하는 post를 가져온다.
  @Get(':id')
  getPost(@Param('id') id: string): Promise<PostsModel> {
    return this.postsService.getPostById(+id);
  }

  // 3) POST /posts
  // POST를 생성한다.
  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(authorId, title, content);
  }

  // 4) PUT /posts/:id
  // id에 해당하는 POST를 변경한다.
  @Put(':id')
  putPosts(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ): Promise<PostsModel> {
    return this.postsService.updatePost(+id, title, content);
  }

  // 5) DELETE /posts/:id
  // id에 해당하는 POST를 삭제한다.
  @Delete(':id')
  deletePosts(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
