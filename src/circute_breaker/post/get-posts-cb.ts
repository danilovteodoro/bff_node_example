import Redis from 'ioredis'

import { GenericCircuitBreaker } from 'circute_breaker/generic-circuit-breaker'
import { PostService } from 'services/post'
import { Post } from 'services/types'

export class GetPostsCb extends GenericCircuitBreaker<unknown[], Post[]> {
  private postService: PostService
  constructor(postService: PostService, redis: Redis) {
    super('getPosts', redis, {
      errorThresholdPercentage: 90,
      resetTimeout: 10000,
    })
    this.postService = postService
  }

  async execute(): Promise<Post[]> {
    return await this.postService.getPosts()
  }

  async getPosts() {
    return this.fire()
  }
}
