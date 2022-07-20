<script lang="ts">
  import BN from 'bn.js'
  import BigNumberInput from '@/presentation/components/BigNumberInput.svelte'
  import {stakingAccountInfo} from '@/application/useNearStaking'
  import {thousandComma} from '@/presentation/helpers'
  import {
    unstakeFromStakingPool,
    signUnstakeFromStakingPool,
  } from '@/application/useNearStaking'

  let token: BN | undefined = undefined

  interface StakingAccountView {
    accountStaked: string
    accountStakedNumber: BN
  }

  let stakingAccountView: StakingAccountView = {
    accountStaked: 'Loading...',
    accountStakedNumber: new BN(0),
  }

  $: $stakingAccountInfo.onHasData(data => {
    const _balance = data.stakeBalance.getOrElse(new BN(0))
    stakingAccountView.accountStaked =
      thousandComma(_balance.toString()) + ' LINE'
    stakingAccountView.accountStakedNumber = _balance
  })

  const maxToken = () => {
    token = stakingAccountView.accountStakedNumber
  }

  $: {
    if (token?.gt(stakingAccountView.accountStakedNumber)) {
      maxToken()
    }
  }
</script>

<div class="form-control w-full">
  <div>
    <div class="flex my-2 gap-3 place-content-between">
      <span>Staked balance:</span>
      <span>{stakingAccountView.accountStaked}</span>
    </div>
    <div class="flex items-center">
      <button
        on:click|preventDefault={() => maxToken()}
        class="btn btn-sm btn-ghost mr-2"
      >
        Max
      </button>
      <BigNumberInput bind:value={token} />
    </div>
  </div>
</div>
<div>
  <p class="my-1">
    Unstaked tokens will be made available pending a release period of ~12hrs (1
    epochs).
  </p>
  <button
    on:click|preventDefault={() => signUnstakeFromStakingPool(token)}
    class="btn btn-secondary w-full"
    class:loading={$unstakeFromStakingPool.loading}
    class:btn-disabled={$unstakeFromStakingPool.loading ||
      !token?.gt(new BN(0))}
  >
    Unstake
  </button>
</div>
