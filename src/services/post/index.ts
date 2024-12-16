import { Http } from "../../utils/http";
import { Post, PostItem } from "../types";

export class PostService {
  private  client: Http

  constructor () {
    this.client = new Http('http://localhost:3001')
  }

  async getPosts(limit: number = 5): Promise<PostItem[]>{
    try {
      const posts: Post[] = await this.client.get('/posts')
      const postItems: PostItem[] = []
      
      for(const post of posts) {
        if(postItems.length >= limit) break

        postItems.push({
          id: post.id,
          title: post.title,
          author: "todo"
        })
      }

      return postItems
    } catch(error) {
      console.log(error)
      throw error
    }
  }
}