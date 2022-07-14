import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class DisplayNameValue extends ValueObject<string> {
  protected name = 'DisplayName'
  protected schema = z.string().max(DisplayNameValue.MAX_LENGTH())

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static MAX_LENGTH() {
    return 30
  }
}
