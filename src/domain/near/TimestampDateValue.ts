import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export class TimestampDateValue extends ValueObject<Date, string | number> {
  protected name = 'TimestampDateValue'
  protected schema = z.string().transform(x => new Date(parseInt(x)))

  constructor(_input: string) {
    super(_input)
    this.parse()
  }
}
