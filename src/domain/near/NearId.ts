import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class NearId extends ValueObject<string> {
  protected name = 'NearId'
  protected schema = z
    .string()
    .refine(data => data.includes('.testnet') || data.includes('.mainnet'), {
      message: 'must ends with .testnet or .mainnet',
      path: [],
    })

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new NearId('not-supported')
  }
}
