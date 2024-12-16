export type Post = {
  id: number,
  title: string
  author: string
  text: string
  comments: Comment[] 
}

export type Comment = {
  user: string
  text: string
}

export type PostItem = Pick<Post,'id' | 'title'> &{
  author: string
}