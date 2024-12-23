import { GenericCircuitBreaker } from "circute_breaker/GenericCircuitBreaker";
import { PostService } from "services/post";
import { Post } from "services/types";


export class GetPostsCb extends GenericCircuitBreaker<unknown[], Post[]> {
  private postService: PostService
  constructor(postService: PostService) {
    super('getPosts', {
      errorThresholdPercentage: 90,
      resetTimeout: 10000
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
