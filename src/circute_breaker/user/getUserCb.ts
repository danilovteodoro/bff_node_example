import CircuitBreaker from "opossum";
import { UserService } from "services/user";
import { User } from "services/types";

export class GetUserCb extends CircuitBreaker<number[], User> {
  constructor(userService: UserService) {
    super(async(id: number) => {
      return userService.getUser(id)
    },{
      errorThresholdPercentage: 10,
      resetTimeout: 10000
    })

    this.fallback(async() => {})
  }

  async getUser(id: number): Promise<User> {
    return this.fire(id)
  }
}