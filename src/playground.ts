import axios, { AxiosResponse } from "axios";
import { PostItem } from "services/types";

(async ()=> {
  const client = axios.create({
    baseURL: 'http://localhost:3001'
  })

  type Post = {
    id: number,
    title: string
    authorId: number
    text: string
  }

  type PostItem = Pick<Post,'id' | 'title'> &{
    author: string
  }

  async function getPosts(): Promise<Post[]> {
    const resp: AxiosResponse<Post[]> = await client.get('/posts')
    return resp.data
  }

  const posts = await getPosts()
  // const m = posts.map((p) => {
  //   return {
  //     id: p.id,
  //     title: p.title,
  //     authorId: p.authorId
  //   }
  // })
  const postItem: PostItem = {
    id: posts[0].id,
    title: posts[0].title,
    author: posts[0].authorId + ' ??'
  }

  console.log(postItem)
})();