import { Http } from "../../utils/http";
import { Post } from "../types";

export class PostService {
  private client: Http

  constructor () {
    this.client = new Http('http://localhost:3001')
  }

  async getPosts(limit: number = 5): Promise<Post[]>{
    try {
      const posts: Post[] = await this.client.get('/posts')

      return posts.slice(0, limit)
    } catch(error) {
      throw error
    }
  }

  async getPost(id: number): Promise<Post> {
   try {
    const post: Post = await this.client.get(`/posts/${id}`)
    return post
   } catch(error) {
     throw error
   }
  }
}