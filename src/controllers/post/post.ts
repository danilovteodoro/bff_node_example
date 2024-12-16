import { PostService } from "../../services/post";
import { PostItem, Post } from "../../services/types";

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

  async getPost(id: number): Promise<Post> {
    try {
      return await this.postService.getPost(id)
    } catch(error) {
      console.log(error)
      return {} as Post
    }
  }
}