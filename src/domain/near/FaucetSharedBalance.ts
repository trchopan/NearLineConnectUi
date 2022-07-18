import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {ContractId} from './ContractId'

interface FaucetSharedBalanceProps {
  balance: BigNumberValue
}

export class FaucetSharedBalance extends Entity<FaucetSharedBalanceProps, ContractId> {
  constructor(props: FaucetSharedBalanceProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get balance() {
    return this.props.balance
  }
}

export class FaucetSharedBalanceMapper {
  // static toDTO(): object {}

  static toDomain(balance: any): FaucetSharedBalance {
    try {
      return new FaucetSharedBalance(
        {
          balance: new BigNumberValue(balance),
        },
        new ContractId('')
      )
    } catch (err) {}
  }

  // TODO static toPersist(sp: FaucetSharedBalance) {}
}
