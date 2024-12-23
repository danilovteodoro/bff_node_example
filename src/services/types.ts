export type Post = {
  id: number
  title: string
  authorId: number
  text: string
}

export type User = {
  id: number
  name: string
}

export type Comment = {
  id: number
  userId: number
  postId: number
  text: string
}
