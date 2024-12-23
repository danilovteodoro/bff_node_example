import { Http } from '../../utils/http'
import { Post } from '../types'

export class PostService {
  private client: Http

  constructor() {
    this.client = new Http('http://localhost:3001')
  }

  async getPosts(limit: number = 5): Promise<Post[]> {
    const posts: Post[] = await this.client.request(
      {
        url: '/posts',
        method: 'GET',
      },
      {
        timeout: 3000,
      }
    )

    return posts.slice(0, limit)
  }

  async getPost(id: number): Promise<Post> {
    const post: Post = await this.client.request(
      {
        url: `/posts/${id}`,
        method: 'GET',
      },
      {
        timeout: 3000,
      }
    )
    return post
  }
}
