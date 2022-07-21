import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {ContractId} from './ContractId'

interface FaucetInfoProps {
  totalBalanceShare: BigNumberValue
  totalShared: BigNumberValue
  totalAccountShared: BigNumberValue
  maxSharePerAccount: BigNumberValue
  isPaused: boolean
}

export class FaucetInfo extends Entity<FaucetInfoProps, ContractId> {
  constructor(props: FaucetInfoProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get totalBalanceShare() {
    return this.props.totalBalanceShare
  }

  get totalShared() {
    return this.props.totalShared
  }

  get totalAccountShared() {
    return this.props.totalAccountShared
  }

  get maxSharePerAccount() {
    return this.props.maxSharePerAccount
  }

  get isPaused() {
    return this.props.isPaused
  }
}

export class FaucetInfoMapper {
  // static toDTO(): object {}

  static toDomain({
    total_balance_share,
    total_shared,
    total_account_shared,
    max_share_per_account,
    is_paused,
  }: any): FaucetInfo {
    return new FaucetInfo(
      {
        totalBalanceShare: new BigNumberValue(total_balance_share),
        totalShared: new BigNumberValue(total_shared),
        totalAccountShared: new BigNumberValue(total_account_shared),
        maxSharePerAccount: new BigNumberValue(max_share_per_account),
        isPaused: is_paused,
      },
      new ContractId('')
    )
  }

  // TODO static toPersist(sp: FaucetInfo) {}
}
