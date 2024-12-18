import CircuitBreaker from "opossum";
import { Post } from "services/types";
import { PostService } from "services/post";

export class GetPostCb extends CircuitBreaker<number[], Post> {
  
  constructor(postService: PostService) {
    super(
      async(id) => {
        return postService.getPost(id)
      },{
        errorThresholdPercentage: 90,
        resetTimeout: 10000
      }
    )

    this.fallback(async(id) => {return []})
  }

  async getPost(id: number): Promise<Post> {
    return this.fire(id)
  }
}