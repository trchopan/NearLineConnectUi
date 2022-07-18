import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {ContractId} from './ContractId'

interface FungibleStorageBalanceProps {
  balance: BigNumberValue
}

export class FungibleStorageBalance extends Entity<FungibleStorageBalanceProps, ContractId> {
  constructor(props: FungibleStorageBalanceProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get balance() {
    return this.props.balance
  }
}

export class FungibleStorageBalanceMapper {
  // static toDTO(): object {}

  static toDomain(balance: any): FungibleStorageBalance {
    try {
      return new FungibleStorageBalance(
        {
          balance: new BigNumberValue(balance),
        },
        new ContractId('')
      )
    } catch (err) {}
  }

  // TODO static toPersist(sp: FungibleStorageBalance) {}
}
