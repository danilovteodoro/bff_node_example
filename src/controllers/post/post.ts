import { Comment, Post, PostItem } from "controllers/types";
import { PostService } from "../../services/post";
import { UserService } from "../../services/user";
import { CommentService } from "../../services/comment";
import { 
  Post as PostApi,
  User as UserApi,
  Comment as CommentApi
} from "../../services/types";
import { GetPostsCb } from '../../circute_breaker/post/getPostsCb';
import { GetUserCb } from "../../circute_breaker/user/getUserCb";
import { GetCommentsCb } from "../../circute_breaker/comment/getCommentsCb";
import { GetPostCb } from "../../circute_breaker/post/getPostCb";

export class PostController {

  private cbGetPosts: GetPostsCb
  private cbGetPost: GetPostCb
  private cbGetUser: GetUserCb
  private cbGetComments: GetCommentsCb

  constructor() {
    const postService = new PostService()
    const userService = new UserService()
    const commentService = new CommentService()
    
    this.cbGetPosts = new GetPostsCb(postService)
    this.cbGetPost = new GetPostCb(postService)
    this.cbGetUser = new GetUserCb(userService)
    this.cbGetComments = new GetCommentsCb(commentService)
  }

  async getPosts(): Promise<PostItem[]>{
    try {
      const posts = await this.cbGetPosts.getPosts()

      const resultPromises = posts.map(async(post) => {
        const user = await this.cbGetUser.getUser(post.authorId)

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
        this.cbGetPost.getPost(id),
        this.cbGetComments.getComments(id),
      ])

      const author: UserApi =  await this.cbGetUser.getUser(id)

      const commentsPromises = commentsApi.map(async(comment) => {
        const user = await this.cbGetUser.getUser(comment.userId)

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