import { UserService } from "services/user";
import { User } from "services/types";
import { GenericCircuitBreaker } from "circute_breaker/GenericCircuitBreaker";
import Redis from "ioredis";

export class GetUserCb extends GenericCircuitBreaker<number[], User> {
  private userService: UserService
  constructor(userService: UserService, redis: Redis) {
    super('getUser', redis)
    this.userService = userService
  }

  async execute(params: number[]): Promise<User> {
    return await this.userService.getUser(params[0])
  }

  async getUser(id: number): Promise<User> {
    return this.fire(id)
  }
}