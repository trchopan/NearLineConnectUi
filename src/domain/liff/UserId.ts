import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class UserId extends ValueObject<string> {
  protected name = 'UserId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new UserId('not-supported')
  }
}
