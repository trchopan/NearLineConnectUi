import {Entity, EntityCorrupted} from '@/domain/core/Entity'
import {ContractId} from './ContractId'
import {NearId} from './NearId'
import {NonfungibleMetadataValue} from './NonfungibleMetadataValue'
import * as E from 'fp-ts/Either'

interface NonfungibleInfoProps {
  token_id: string
  owner_id: NearId
  metadata: NonfungibleMetadataValue
}

export class NonfungibleInfo extends Entity<NonfungibleInfoProps, ContractId> {
  constructor(props: NonfungibleInfoProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get tokenId() {
    return this.props.token_id
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
        token_id,
        owner_id: new NearId(owner_id),
        metadata: new NonfungibleMetadataValue(metadata),
      },
      new ContractId('')
    )
  }

  // TODO static toPersist(sp: NonfungibleInfo) {}
}
