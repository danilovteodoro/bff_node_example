import { PostService } from "../../services/post";
import { PostItem } from "../../services/types";

export class PostController {
  private postService: PostService

  constructor() {
    this.postService = new PostService()
  }

  async getPosts(): Promise<PostItem[]>{
    try {
      return await this.postService.getPosts()
    } catch(error) {
      console.log(error)
      return []
    }
  }
}