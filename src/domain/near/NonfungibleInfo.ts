import {Entity} from '@/domain/core/Entity'
import {NearId} from './NearId'
import {NonfungibleMetadataValue} from './NonfungibleMetadataValue'
import {NonfungibleTokenId} from './NonfungibleTokenId'

interface NonfungibleInfoProps {
  owner_id: NearId
  metadata: NonfungibleMetadataValue
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
        metadata: new NonfungibleMetadataValue(metadata),
      },
      new NonfungibleTokenId(token_id)
    )
  }

  static toPersist(v: NonfungibleInfo) {
    const metadata = v.metadata.getOrCrash()
    const persistMetadata = {
      ...metadata,
      extra: metadata.extra.toString(),
    }
    return {
      token_id: v.tokenId.getOrCrash(),
      receiver_id: v.ownerId.getOrCrash(),
      token_metadata: persistMetadata,
    }
  }
}
