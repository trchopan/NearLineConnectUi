import {Entity} from '@/domain/core/Entity'
import {NearId} from './NearId'
import {
  NonfungibleMetadata,
  NonfungibleMetadataMapper,
} from './NonfungibleMetadata'
import {NonfungibleTokenId} from './NonfungibleTokenId'

interface NonfungibleInfoProps {
  owner_id: NearId
  metadata: NonfungibleMetadata
}

export class NonfungibleInfo extends Entity<
  NonfungibleInfoProps,
  NonfungibleTokenId
> {
  constructor(props: NonfungibleInfoProps, _id: NonfungibleTokenId) {
    super(props, _id)
  }

  get tokenId() {
    return this._id
  }

  get ownerId() {
    return this.props.owner_id
  }

  get metadata() {
    return this.props.metadata
  }
}

export class NonfungibleInfoMapper {
  // static toDTO(): object {}

  static toDomain(v: any | null): NonfungibleInfo {
    const {token_id, owner_id, metadata} = v || {}
    return new NonfungibleInfo(
      {
        owner_id: new NearId(owner_id),
        metadata: new NonfungibleMetadata(metadata, token_id),
      },
      new NonfungibleTokenId(token_id)
    )
  }

  static toPersist(v: NonfungibleInfo) {
    const metadata = NonfungibleMetadataMapper.toPersist(v.metadata)
    return {
      token_id: v.tokenId.getOrCrash(),
      receiver_id: v.ownerId.getOrCrash(),
      token_metadata: metadata,
    }
  }
}
