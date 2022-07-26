import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class LineId extends ValueObject<string> {
  protected name = 'LineId'
  protected schema = z.string()

  constructor(_input: string) {
    super(_input)
    this.parse()
  }

  static new() {
    return new LineId('not-supported')
  }
}
