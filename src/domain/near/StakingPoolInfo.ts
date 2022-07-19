import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {ContractId} from './ContractId'

interface StakingPoolInfoProps {
  isPaused: boolean
  totalPaidRewardBalance: BigNumberValue
  totalReward: BigNumberValue
  totalStakeBalance: BigNumberValue
  totalStakers: BigNumberValue
}

export class StakingPoolInfo extends Entity<StakingPoolInfoProps, ContractId> {
  constructor(props: StakingPoolInfoProps, _id: ContractId) {
    super(props, _id)
  }

  get contractId() {
    return this._id
  }

  get isPaused() {
    return this.props.isPaused
  }

  get totalPaidRewardBalance() {
    return this.props.totalPaidRewardBalance
  }

  get totalReward() {
    return this.props.totalReward
  }

  get totalStakeBalance() {
    return this.props.totalStakeBalance
  }

  get totalStakers() {
    return this.props.totalStakers
  }
}

export class StakingPoolInfoMapper {
  // static toDTO(): object {}

  static toDomain(v: any): StakingPoolInfo {
    const {
      is_paused,
      total_paid_reward_balance,
      total_reward,
      total_stake_balance,
      total_stakers,
    } = v
    return new StakingPoolInfo(
      {
        isPaused: is_paused,
        totalPaidRewardBalance: new BigNumberValue(total_paid_reward_balance),
        totalReward: new BigNumberValue(total_reward),
        totalStakeBalance: new BigNumberValue(total_stake_balance),
        totalStakers: new BigNumberValue(total_stakers),
      },
      new ContractId('')
    )
  }

  // TODO static toPersist(sp: StakingPoolInfo) {}
}
