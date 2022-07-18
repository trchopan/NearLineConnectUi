import {z} from 'zod'
import BN from 'bn.js'
import {ValueObject} from '@/domain/core/ValueObject'

export class BigNumberValue extends ValueObject<BN, string> {
  protected name = 'BigNumberValue'
  protected schema = z
    .string()
    .regex(/^\d*/)
    .transform(x => new BN(x))

  constructor(_input: string) {
    super(_input)
    this.parse()
  }
}
