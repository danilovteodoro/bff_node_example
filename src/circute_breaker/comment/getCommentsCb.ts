import CircuitBreaker from "opossum";
import { CommentService } from "services/comment";
import { Comment } from "services/types";

export class GetCommentsCb extends CircuitBreaker<number[], Comment[]> {
  constructor(commentService: CommentService) {
    super(
      async(postId: number): Promise<Comment[]> => {
        return await commentService.getComments(postId)
      },{
        errorThresholdPercentage: 10,
        resetTimeout: 10000
      }
    )

    this.fallback(async() => [])
  }

  private async tt(postId: number): Promise<Comment[]> {
    return await new CommentService().getComments(postId)
  }

  async getComments(postId: number): Promise<Comment[]> {
    return this.fire(postId)
  }
}