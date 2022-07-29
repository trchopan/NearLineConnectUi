import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {NonfungibleTokenId} from './NonfungibleTokenId'

interface NonfungibleMetadataProps {
  title: string
  description: string
  media: string
  extra: BigNumberValue
}

export class NonfungibleMetadata extends Entity<
  NonfungibleMetadataProps,
  NonfungibleTokenId
> {
  constructor(props: NonfungibleMetadataProps, _id: NonfungibleTokenId) {
    super(props, _id)
  }

  get tokenId() {
    return this._id
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get media() {
    return this.props.media
  }

  get extra() {
    return this.props.extra
  }
}

export class NonfungibleMetadataMapper {
  // static toDTO(): object {}

  static toDomain(v: any | null, token_id: string): NonfungibleMetadata {
    const {title, description, media, extra} = v || {}
    return new NonfungibleMetadata(
      {
        title,
        description,
        media,
        extra: new BigNumberValue(extra),
      },
      new NonfungibleTokenId(token_id)
    )
  }

  static toPersist(v: NonfungibleMetadata) {
    return {
      title: v.title,
      description: v.description,
      media: v.media,
      extra: v.extra.toString(),
    }
  }
}
