import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

const schema = z.object({
  title: z.string(),
  description: z.string(),
  media: z.string(),
  copies: z.number(),
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
