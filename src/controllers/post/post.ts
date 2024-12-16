import { Comment, Post, PostItem } from "controllers/types";
import { PostService } from "../../services/post";
import { UserService } from "../../services/user";
import { CommentService } from "../../services/comment";
import { 
  Post as PostApi,
  User as UserApi,
  Comment as CommentApi
} from "../../services/types";

export class PostController {
  private postService: PostService
  private userService: UserService
  private commentService: CommentService

  constructor() {
    this.postService = new PostService()
    this.userService = new UserService()
    this.commentService = new CommentService()
  }

  async getPosts(): Promise<PostItem[]>{
    try {
      const posts = await this.postService.getPosts()

      const resultPromises = posts.map(async(post) => {
        const user = await this.userService.getUser(post.authorId)

        return {
          id: post.id,
          title: post.title,
          author: user.name
        }
      })

      const result = await Promise.all(resultPromises)
      return result
    } catch(error) {
      console.log(error)
      return []
    }
  }

  async getPost(id: number): Promise<Post> {
    try {
      const [postApi, commentsApi] =  await Promise.all([
        this.postService.getPost(id),
        this.commentService.getComments(id),
      ])

      const author: UserApi =  await this.userService.getUser(id)

      const commentsPromises = commentsApi.map(async(comment) => {
        const user = await this.userService.getUser(comment.userId)

        return {
          user: user.name,
          text: comment.text
        }
      })

      const comments = await Promise.all(commentsPromises)

      return parsePost(postApi, author.name, comments)
    } catch(error) {
      console.log(error)
      return {} as Post
    }
  }
}

function parsePost(postApi: PostApi, author: string, comments: Comment[]): Post {
  return {
    id: postApi.id,
    title: postApi.title,
    text: postApi.text,
    author: author,
    comments: comments
  }
}