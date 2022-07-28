import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class SignatureId extends ValueObject<string> {
  protected name = 'SignatureId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new SignatureId('not-supported')
  }
}
