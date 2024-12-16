export type Post = {
  id: number,
  title: string
  authorId: number
  text: string
}

export type PostItem = Pick<Post,'id' | 'title'> &{
  author: string
}