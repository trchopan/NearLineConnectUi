import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class LiffId extends ValueObject<string> {
  protected name = 'LiffId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new LiffId('not-supported')
  }
}
