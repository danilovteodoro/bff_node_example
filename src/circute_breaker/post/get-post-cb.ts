import Redis from 'ioredis'

import { GenericCircuitBreaker } from 'circute_breaker/generic-circuit-breaker'
import { PostService } from 'services/post'
import { Post } from 'services/types'

export class GetPostCb extends GenericCircuitBreaker<number[], Post> {
  private postService: PostService
  constructor(postService: PostService, redis: Redis) {
    super('getPost', redis, {
      errorThresholdPercentage: 90,
      resetTimeout: 10000,
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
