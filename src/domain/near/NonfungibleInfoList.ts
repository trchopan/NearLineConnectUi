import {Entity} from '@/domain/core/Entity'
import {ContractId} from './ContractId'
import {NonfungibleInfo, NonfungibleInfoMapper} from './NonfungibleInfo'

interface NonfungibleInfoListProps {
  tokens: NonfungibleInfo[]
}

export class NonfungibleInfoList extends Entity<
  NonfungibleInfoListProps,
  ContractId
> {
  constructor(props: NonfungibleInfoListProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get tokens() {
    return this.props.tokens
  }

  get orderedTokens() {
    return this.props.tokens.sort((a, b) => (a.tokenId > b.tokenId ? -1 : 1))
  }
}

export class NonfungibleInfoListMapper {
  // static toDTO(): object {}

  static toDomain(v: any): NonfungibleInfoList {
    return new NonfungibleInfoList(
      {
        tokens: ((v || []) as any[]).map(NonfungibleInfoMapper.toDomain),
      },
      new ContractId('')
    )
  }

  // TODO static toPersist(sp: NonfungibleInfoList) {}
}
