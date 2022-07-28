import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'
import BN from 'bn.js'

const schema = z.object({
  title: z.string(),
  description: z.string(),
  media: z.string(),
  extra: z
    // .preprocess(v => (typeof v === 'string' ? parseInt(v) : v), z.number())
    .string()
    .nullable()
    .transform(x => new BN(x)),
})

export class NonfungibleMetadataValue extends ValueObject<
  z.infer<typeof schema>
> {
  protected name = 'NonfungibleMetadataValue'
  protected schema = schema

  constructor(_input: any) {
    super(_input)
    this.parse()
  }

  static new() {
    return new NonfungibleMetadataValue('not-supported')
  }
}
