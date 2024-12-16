import { Http } from "../../utils/http";
import {User}  from "../types";

export class UserService {
  private client: Http

  constructor() {
    this.client = new Http('http://localhost:3002')
  }

  async getUser(id: number): Promise<User> {
    try {
      const user: User = await this.client.get(`/users/${id}`)
      return user
    } catch(error) {
      throw error
    }
  }
}