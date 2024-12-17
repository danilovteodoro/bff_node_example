import { Comment } from "services/types";
import { Http } from "../../utils/http";

export class CommentService {
  private client: Http

  constructor() {
    this.client = new Http('http://localhost:3003')
  }

  async getComments(postId: number): Promise<Comment[]> {
    try {
      const comments: Comment[] = await this.client.request(
        {
          url: '/comments',
          params: {postId: postId},
          method: 'GET'
        },{
          timeout: 3000
        })

      return comments
    } catch(error) {
      throw error
    }
  }
}