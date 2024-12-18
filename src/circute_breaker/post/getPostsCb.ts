import CircuitBreaker from "opossum";
import { PostService } from "services/post";
import { Post } from "services/types";


export class GetPostsCb extends CircuitBreaker<unknown[], Post[]> {
  constructor(postService: PostService) {
    super(async () => {
      this.fallback(async() => {
        return [] as Post[]

      })

      this.addListener('fallback', ()=> console.log('fallback'))
      this.addListener('reject', ()=> console.log('reject'))
      this.addListener('failure', ()=> console.log('failure'))

      return postService.getPosts()
    },{
      errorThresholdPercentage: 90,
      resetTimeout: 10000
    })
  }
 
  async getPosts() {
    return this.fire()
  }
  
}