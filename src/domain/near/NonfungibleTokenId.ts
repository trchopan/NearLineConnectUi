import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class NonfungibleTokenId extends ValueObject<string> {
  protected name = 'NonfungibleTokenId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new NonfungibleTokenId('not-supported')
  }
}
