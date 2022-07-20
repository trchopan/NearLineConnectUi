import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {NearId} from './NearId'

interface FungibleAccountBalanceProps {
  balance: BigNumberValue
}

export class FungibleAccountBalance extends Entity<
  FungibleAccountBalanceProps,
  NearId
> {
  constructor(props: FungibleAccountBalanceProps, _id: NearId) {
    super(props, _id)
  }

  get accountId() {
    return this._id
  }

  get balance() {
    return this.props.balance
  }
}

export class FungibleAccountBalanceMapper {
  // static toDTO(): object {}

  static toDomain(balance: any): FungibleAccountBalance {
    return new FungibleAccountBalance(
      {
        balance: new BigNumberValue(balance),
      },
      new NearId('')
    )
  }

  // TODO static toPersist(sp: FungibleAccountBalance) {}
}
