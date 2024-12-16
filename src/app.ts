import { PostController } from './controllers/post/post'
import express from 'express'

const app = express()

app.get('/', (req,res) => {
  res.send('Hello World!2')
})

const postController: PostController = new PostController()
app.get('/posts', async(req, res) => {
  const posts = await postController.getPosts()
  res.json(posts)
})

app.listen(3000, () => {
  return console.log(`Express is listening at http://localhost:3000`);
})
