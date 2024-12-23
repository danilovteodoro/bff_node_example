import { Post } from "services/types";
import { PostService } from "services/post";
import { GenericCircuitBreaker } from "circute_breaker/GenericCircuitBreaker";
import Redis from "ioredis";

export class GetPostCb extends GenericCircuitBreaker<number[], Post> {

  private postService: PostService
  constructor(postService: PostService, redis: Redis) {
    super('getPost',
      redis, {
      errorThresholdPercentage: 90,
      resetTimeout: 10000
    })
    this.postService = postService
  }

  async execute(params: number[]): Promise<Post> {
    return await this.postService.getPost(params[0])
  }
  async getPost(id: number): Promise<Post> {
    return this.fire(id)
  }
}
