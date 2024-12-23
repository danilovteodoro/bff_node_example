import { Http } from '../../utils/http'
import { User } from '../types'

export class UserService {
  private client: Http

  constructor() {
    this.client = new Http('http://localhost:3002')
  }

  async getUser(id: number): Promise<User> {
    const user: User = await this.client.request(
      {
        url: `/users/${id}`,
        method: 'GET',
      },
      {
        timeout: 3000,
      }
    )

    return user
  }
}
