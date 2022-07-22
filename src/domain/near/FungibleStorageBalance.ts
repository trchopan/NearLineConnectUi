import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {ContractId} from './ContractId'

interface FungibleStorageBalanceProps {
  total: BigNumberValue
  avaiable: BigNumberValue
}

export class FungibleStorageBalance extends Entity<
  FungibleStorageBalanceProps,
  ContractId
> {
  constructor(props: FungibleStorageBalanceProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get total() {
    return this.props.total
  }

  get avaiable() {
    return this.props.avaiable
  }
}

export class FungibleStorageBalanceMapper {
  // static toDTO(): object {}

  static toDomain(v: any): FungibleStorageBalance {
    const {total, avaiable} = v || {};
    return new FungibleStorageBalance(
      {
        total: new BigNumberValue(total),
        avaiable: new BigNumberValue(avaiable),
      },
      new ContractId('')
    )
  }

  // TODO static toPersist(sp: FungibleStorageBalance) {}
}
