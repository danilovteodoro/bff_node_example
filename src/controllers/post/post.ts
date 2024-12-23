import Redis from 'ioredis'

import { Comment, Post, PostItem } from 'controllers/types'

import { GetCommentsCb } from '../../circute_breaker/comment/get-comments-cb'
import { GetPostCb } from '../../circute_breaker/post/get-post-cb'
import { GetPostsCb } from '../../circute_breaker/post/get-posts-cb'
import { GetUserCb } from '../../circute_breaker/user/get-user-cb'
import { CommentService } from '../../services/comment'
import { PostService } from '../../services/post'
import { Post as PostApi, User as UserApi } from '../../services/types'
import { UserService } from '../../services/user'

export class PostController {
  private cbGetPosts: GetPostsCb
  private cbGetPost: GetPostCb
  private cbGetUser: GetUserCb
  private cbGetComments: GetCommentsCb

  constructor(redis: Redis) {
    const postService = new PostService()
    const userService = new UserService()
    const commentService = new CommentService()

    this.cbGetPosts = new GetPostsCb(postService, redis)
    this.cbGetPost = new GetPostCb(postService, redis)
    this.cbGetUser = new GetUserCb(userService, redis)
    this.cbGetComments = new GetCommentsCb(commentService, redis)
  }

  async getPosts(): Promise<PostItem[]> {
    try {
      const posts = await this.cbGetPosts.getPosts()

      const resultPromises = posts.map(async (post) => {
        const user = await this.cbGetUser.getUser(post.authorId)

        return {
          id: post.id,
          title: post.title,
          author: user.name,
        }
      })

      const result = await Promise.all(resultPromises)
      return result
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async getPost(id: number): Promise<Post> {
    try {
      const [postApi, commentsApi] = await Promise.all([this.cbGetPost.getPost(id), this.cbGetComments.getComments(id)])

      const author: UserApi = await this.cbGetUser.getUser(id)

      const commentsPromises = commentsApi.map(async (comment) => {
        const user = await this.cbGetUser.getUser(comment.userId)

        return {
          user: user.name,
          text: comment.text,
        }
      })

      const comments = await Promise.all(commentsPromises)

      return parsePost(postApi, author.name, comments)
    } catch (error) {
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
    comments: comments,
  }
}
