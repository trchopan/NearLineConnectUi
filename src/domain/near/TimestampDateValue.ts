import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class TimestampDateValue extends ValueObject<Date, string | number> {
  protected name = 'TimestampDateValue'
  protected schema = z.number().transform(x => new Date(x / 1_000_000))

  constructor(_input: string) {
    super(_input)
    this.parse()
  }
}
