import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class ContractId extends ValueObject<string> {
  protected name = 'ContractId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new ContractId('not-supported')
  }
}
