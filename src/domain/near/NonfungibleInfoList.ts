import * as E from 'fp-ts/Either'
import {Entity, EntityCorrupted} from '@/domain/core/Entity'
import {ContractId} from './ContractId'
import {NonfungibleInfo, NonfungibleInfoMapper} from './NonfungibleInfo'

interface NonfungibleInfoListProps {
  tokens: E.Either<EntityCorrupted, NonfungibleInfo>[]
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
}

export class NonfungibleInfoListMapper {
  // static toDTO(): object {}

  static toDomain(v: any): E.Either<EntityCorrupted, NonfungibleInfoList> {
    return E.tryCatch(
      () => {
        return new NonfungibleInfoList(
          {
            tokens: (v as any[]).map(NonfungibleInfoMapper.toDomain),
          },
          new ContractId('')
        )
      },
      err => new EntityCorrupted('NonfungibleInfoMapper', err)
    )
  }

  // TODO static toPersist(sp: NonfungibleInfoList) {}
}
