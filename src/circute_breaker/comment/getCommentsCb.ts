import { GenericCircuitBreaker } from "circute_breaker/GenericCircuitBreaker";
import { CommentService } from "services/comment";
import { Comment } from "services/types";

export class GetCommentsCb extends GenericCircuitBreaker<number[], Comment[]> {

  private commentService: CommentService
  constructor(commentService: CommentService) {
    super()
    this.commentService = commentService
  }

  async execute(params: number[]): Promise<Comment[]> {
    return await this.commentService.getComments(params[0])
  }

  async getComments(postId: number): Promise<Comment[]> {
    return this.fire(postId)
  }
}