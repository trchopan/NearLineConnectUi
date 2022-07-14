import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class NearId extends ValueObject<string> {
  protected name = 'NearId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new NearId('not-supported')
  }
}
