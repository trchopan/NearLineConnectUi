import {Entity} from '@/domain/core/Entity'
import {BigNumberValue} from './BigNumberValue'
import {NearId} from './NearId'
import {TimestampDateValue} from './TimestampDateValue'

interface StakingAccountInfoProps {
  canWithdraw: boolean
  stakeBalance: BigNumberValue
  unstakeBalance: BigNumberValue
  reward: BigNumberValue
  unstakeStartTimestamp: TimestampDateValue
}

export class StakingAccountInfo extends Entity<
  StakingAccountInfoProps,
  NearId
> {
  constructor(props: StakingAccountInfoProps, _id: NearId) {
    super(props, _id)
  }

  get accountId() {
    return this._id
  }

  get canWithdraw() {
    return this.props.canWithdraw
  }

  get stakeBalance() {
    return this.props.stakeBalance
  }

  get unstakeBalance() {
    return this.props.unstakeBalance
  }

  get reward() {
    return this.props.reward
  }

  get unstakeStartTimestamp() {
    return this.props.unstakeStartTimestamp
  }
}

export class StakingAccountInfoMapper {
  // static toDTO(): object {}

  static toDomain(v: any): StakingAccountInfo {
    const {
      account_id,
      can_withdraw,
      stake_balance,
      unstake_balance,
      reward,
      unstake_start_timestamp,
    } = v || {}
    try {
      return new StakingAccountInfo(
        {
          canWithdraw: can_withdraw,
          stakeBalance: new BigNumberValue(stake_balance),
          unstakeBalance: new BigNumberValue(unstake_balance),
          reward: new BigNumberValue(reward),
          unstakeStartTimestamp: new TimestampDateValue(
            unstake_start_timestamp
          ),
        },
        new NearId(account_id)
      )
    } catch (err) {}
  }

  // TODO static toPersist(sp: StakingAccountInfo) {}
}
