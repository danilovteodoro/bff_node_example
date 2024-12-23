import Redis from 'ioredis'

import { GenericCircuitBreaker } from 'circute_breaker/generic-circuit-breaker'
import { User } from 'services/types'
import { UserService } from 'services/user'

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
